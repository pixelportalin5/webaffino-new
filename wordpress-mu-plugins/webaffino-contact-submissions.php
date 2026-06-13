<?php
/**
 * Plugin Name: Web Affino Contact Submissions
 * Description: Stores Next.js contact form submissions in WordPress and exposes an admin list table.
 * Version: 1.0.0
 * Author: Web Affino
 */

if (!defined('ABSPATH')) {
    exit;
}

final class WebAffino_Contact_Submissions {
    const TABLE_VERSION = '1.0.0';
    const TABLE_OPTION = 'webaffino_contact_submissions_table_version';
    const SECRET_OPTION = 'webaffino_contact_submissions_secret';

    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
        add_action('admin_menu', [__CLASS__, 'register_admin_page']);
        self::maybe_create_table();
        self::maybe_create_secret();
    }

    public static function maybe_create_secret() {
        if (!get_option(self::SECRET_OPTION)) {
            update_option(self::SECRET_OPTION, wp_generate_password(32, false, false));
        }
    }

    public static function table_name() {
        global $wpdb;
        return $wpdb->prefix . 'webaffino_contact_submissions';
    }

    public static function maybe_create_table() {
        global $wpdb;

        $installed_version = get_option(self::TABLE_OPTION);
        if ($installed_version === self::TABLE_VERSION) {
            return;
        }

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $table_name = self::table_name();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            name varchar(191) NOT NULL,
            email varchar(191) NOT NULL,
            phone varchar(64) NOT NULL,
            message longtext NOT NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY created_at (created_at)
        ) {$charset_collate};";

        dbDelta($sql);
        update_option(self::TABLE_OPTION, self::TABLE_VERSION);
    }

    public static function register_routes() {
        register_rest_route(
            'webaffino/v1',
            '/contact-submissions',
            [
                'methods' => 'POST',
                'callback' => [__CLASS__, 'handle_submission'],
                'permission_callback' => [__CLASS__, 'verify_secret'],
            ]
        );
    }

    public static function verify_secret(WP_REST_Request $request) {
        $provided = $request->get_header('x-webaffino-secret');
        $expected = get_option(self::SECRET_OPTION, '');

        return is_string($provided) && is_string($expected) && $provided !== '' && hash_equals($expected, $provided);
    }

    public static function handle_submission(WP_REST_Request $request) {
        global $wpdb;

        $name = sanitize_text_field((string) $request->get_param('name'));
        $email = sanitize_email((string) $request->get_param('email'));
        $phone = sanitize_text_field((string) $request->get_param('phone'));
        $message = sanitize_textarea_field((string) $request->get_param('message'));

        if ($name === '' || strlen($name) < 2) {
            return new WP_REST_Response(['success' => false, 'message' => 'Invalid name.'], 400);
        }

        if ($email === '' || !is_email($email)) {
            return new WP_REST_Response(['success' => false, 'message' => 'Invalid email.'], 400);
        }

        if ($phone === '') {
            return new WP_REST_Response(['success' => false, 'message' => 'Invalid phone.'], 400);
        }

        if ($message === '') {
            return new WP_REST_Response(['success' => false, 'message' => 'Invalid message.'], 400);
        }

        $inserted = $wpdb->insert(
            self::table_name(),
            [
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'message' => $message,
                'created_at' => current_time('mysql'),
            ],
            ['%s', '%s', '%s', '%s', '%s']
        );

        if (!$inserted) {
            return new WP_REST_Response(['success' => false, 'message' => 'Database insert failed.'], 500);
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'entry_id' => (int) $wpdb->insert_id,
            ],
            201
        );
    }

    public static function register_admin_page() {
        add_menu_page(
            'Contact Submissions',
            'Contact Submissions',
            'manage_options',
            'webaffino-contact-submissions',
            [__CLASS__, 'render_admin_page'],
            'dashicons-email-alt2',
            58
        );
    }

    public static function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        global $wpdb;
        $table_name = self::table_name();
        $rows = $wpdb->get_results("SELECT id, name, email, phone, message, created_at FROM {$table_name} ORDER BY id DESC LIMIT 100");

        echo '<div class="wrap">';
        echo '<h1>Contact Submissions</h1>';
        echo '<p>Stored submissions from the Next.js contact form.</p>';
        echo '<table class="widefat fixed striped">';
        echo '<thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Submitted</th></tr></thead><tbody>';

        if (empty($rows)) {
            echo '<tr><td colspan="6">No submissions yet.</td></tr>';
        } else {
            foreach ($rows as $row) {
                echo '<tr>';
                echo '<td>' . esc_html((string) $row->id) . '</td>';
                echo '<td>' . esc_html($row->name) . '</td>';
                echo '<td>' . esc_html($row->email) . '</td>';
                echo '<td>' . esc_html($row->phone) . '</td>';
                echo '<td>' . esc_html(wp_trim_words($row->message, 18, '...')) . '</td>';
                echo '<td>' . esc_html($row->created_at) . '</td>';
                echo '</tr>';
            }
        }

        echo '</tbody></table></div>';
    }
}

WebAffino_Contact_Submissions::init();
