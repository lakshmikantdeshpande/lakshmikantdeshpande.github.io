// A deliberately conservative demo. Unknown parameters and fragments are preserved.
const trackingKeys = new Set([
  "fbclid",
  "gclid",
  "dclid",
  "msclkid",
  "twclid",
  "ttclid",
  "yclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "_ga",
  "_gl",
]);
export function cleanLink(input) {
  const value = input.trim();
  if (!value) throw new Error("Paste a link to get started.");
  if (!/^https?:\/\/[^/\\]/i.test(value) || /[\u0000-\u0020\u007f]/.test(value))
    throw new Error(
      "Enter a complete http:// or https:// link without spaces or line breaks.",
    );
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "Enter a complete link beginning with https:// or http://.",
    );
  }
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error("Only http:// and https:// links can be cleaned.");
  if (url.username || url.password)
    throw new Error(
      "Remove the username or password from this link before sharing it.",
    );
  // Keep the original encoding/order of all retained query items. URLSearchParams
  // serialization can alter signatures or meaningful encodings on otherwise untouched links.
  const hashAt = value.indexOf("#");
  const hash = hashAt === -1 ? "" : value.slice(hashAt);
  const beforeHash = hashAt === -1 ? value : value.slice(0, hashAt);
  const queryAt = beforeHash.indexOf("?");
  if (queryAt === -1) return { url: value, removed: 0 };
  let removed = 0;
  const originalParts = beforeHash.slice(queryAt + 1).split("&");
  const kept = originalParts.filter((part) => {
    const key = new URLSearchParams(part).keys().next().value?.toLowerCase();
    if (key && (key.startsWith("utm_") || trackingKeys.has(key))) {
      removed++;
      return false;
    }
    return true;
  });
  if (!removed) return { url: value, removed: 0 };
  const query = kept.filter(Boolean).join("&");
  return {
    url: beforeHash.slice(0, queryAt) + (query ? "?" + query : "") + hash,
    removed,
  };
}
