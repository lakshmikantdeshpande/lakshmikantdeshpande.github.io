import test from "node:test";
import assert from "node:assert/strict";
import { cleanLink } from "../src/assets/js/clean-link.js";
test("rejects URLs that would require silent parser repair", () => {
  for (const url of [
    "https:example.com",
    "https:////example.com",
    "https://example.com/a b",
    "https://example.com/a\nb",
  ])
    assert.throws(() => cleanLink(url));
});
test("removes known tracking without touching meaningful parameters or fragments", () => {
  assert.deepEqual(
    cleanLink(
      "https://example.com/read?id=42&utm_source=mail&gclid=x#chapter?keep=1",
    ),
    { url: "https://example.com/read?id=42#chapter?keep=1", removed: 2 },
  );
});
test("recognises encoded, repeated, and mixed-case tracker names", () => {
  assert.deepEqual(
    cleanLink(
      "https://example.com/?UTM_SOURCE=a&%75tm_medium=b&gclid=c&gclid=d",
    ),
    { url: "https://example.com/", removed: 4 },
  );
});
test("preserves original encoding, duplicate values, and parameter order", () => {
  assert.equal(
    cleanLink("https://example.com/?q=a%20b&key=a+b&tag=x&tag=y&utm_source=z")
      .url,
    "https://example.com/?q=a%20b&key=a+b&tag=x&tag=y",
  );
});
test("leaves clean URLs, fragments, and unknown parameters untouched", () => {
  for (const url of [
    "https://example.com",
    "https://example.com/?ref=book#read",
    "http://example.com/a?x=%2f#utm_source=keep",
    "https://example.com/#frag?utm_source=keep",
  ])
    assert.deepEqual(cleanLink(url), { url, removed: 0 });
});
test("trims surrounding whitespace and removes an empty query after cleaning", () => {
  assert.deepEqual(
    cleanLink("  https://example.com/a?utm_source=x#chapter  "),
    { url: "https://example.com/a#chapter", removed: 1 },
  );
});
test("rejects malformed links, unsafe schemes, and embedded credentials", () => {
  for (const url of [
    "",
    "hello",
    "javascript:alert(1)",
    "data:text/html,hi",
    "file:///tmp/hi",
    "//example.com",
    "https://u:p@example.com",
  ])
    assert.throws(() => cleanLink(url));
});
