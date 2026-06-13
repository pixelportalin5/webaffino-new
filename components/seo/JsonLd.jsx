/**
 * @param {Record<string, unknown> | Record<string, unknown>[]} data
 */
export default function JsonLd({ data }) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : data["@graph"]
      ? data
      : data;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
