/**
 * @typedef {Object} WordPressProbeResult
 * @property {string} wpBase
 * @property {string} requestUrl
 * @property {number} status
 * @property {string} statusText
 * @property {Record<string, string>} headers
 * @property {string} bodyPreview
 * @property {boolean} jsonParseSuccess
 * @property {string} responseType
 * @property {string | null} parseError
 * @property {unknown} [parsedJson]
 */

/**
 * @param {string} body
 * @param {string} contentType
 * @returns {"json" | "cloudflare-error" | "html" | "login-page" | "empty" | "plain-text" | "unknown"}
 */
export function detectResponseType(body, contentType = "") {
  const trimmed = body.trim();

  if (!trimmed) {
    return "empty";
  }

  if (
    /^error code:\s*\d+/i.test(trimmed) ||
    /cloudflare/i.test(body) ||
    /origin_bad_gateway|error_name":"origin/i.test(body)
  ) {
    return "cloudflare-error";
  }

  if (/<!doctype html|<html[\s>]/i.test(body)) {
    if (/wp-login|log in|password/i.test(body)) {
      return "login-page";
    }

    return "html";
  }

  if (contentType.includes("application/json") || trimmed.startsWith("[") || trimmed.startsWith("{")) {
    return "json";
  }

  if (contentType.includes("text/plain")) {
    return "plain-text";
  }

  return "unknown";
}

/**
 * @param {Response} response
 * @param {string} body
 * @returns {WordPressProbeResult}
 */
export function buildProbeResult(response, body, wpBase, requestUrl) {
  const headers = Object.fromEntries(response.headers.entries());
  const contentType = headers["content-type"] || "";
  const responseType = detectResponseType(body, contentType);

  let jsonParseSuccess = false;
  let parseError = null;
  let parsedJson;

  try {
    parsedJson = JSON.parse(body);
    jsonParseSuccess = responseType !== "cloudflare-error";
  } catch (error) {
    parseError = error instanceof Error ? error.message : String(error);
  }

  return {
    wpBase,
    requestUrl,
    status: response.status,
    statusText: response.statusText,
    headers,
    bodyPreview: body.slice(0, 500),
    jsonParseSuccess,
    responseType,
    parseError,
    parsedJson
  };
}
