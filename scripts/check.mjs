import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";
const root = resolve("_site");
async function walk(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(join(path, entry.name))
          : join(path, entry.name),
      ),
    )
  ).flat();
}
const files = await walk(root);
const pages = files.filter((file) => file.endsWith(".html"));
let links = 0;
for (const file of pages) {
  const html = await readFile(file, "utf8");
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `${file}: exactly one h1`,
  );
  assert.match(html, /<html lang="en">/, `${file}: document language`);
  assert.match(
    html,
    /<meta name="description" content="[^"]+">/,
    `${file}: description`,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/[^\s"]+">/,
    `${file}: canonical`,
  );
  assert.match(html, /<main id="main"/, `${file}: skip target`);
  assert.ok(
    !html.includes("feed.xml"),
    `${file}: no feed.xml references`,
  );
  assert.ok(
    !html.includes("/writing/"),
    `${file}: no /writing/ references`,
  );
  assert.ok(
    !html.includes("/work/"),
    `${file}: no project-notes references`,
  );
  assert.ok(
    !/rel="alternate"[^>]*application\/atom\+xml/.test(html),
    `${file}: no Atom alternate link`,
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: no duplicate IDs`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const [pathname, fragment] = href.split("#");
    let target = pathname ? join(root, pathname.split("?")[0]) : file;
    if (pathname.endsWith("/")) target = join(target, "index.html");
    await stat(target).catch(() => {
      throw new Error(`${file}: missing target ${href}`);
    });
    if (fragment) {
      const targetHtml = await readFile(target, "utf8");
      assert.ok(
        targetHtml.includes(`id="${fragment}"`),
        `${file}: missing anchor ${href}`,
      );
    }
    links++;
  }
}
for (const name of [
  "index.html",
  "about/index.html",
  "posts/index.html",
  "experience/paypal/index.html",
  "experience/appzen/index.html",
  "experience/clairvoyant/index.html",
  "experience/persistent/index.html",
  "404.html",
  "sitemap.xml",
  "robots.txt",
  ".nojekyll",
  "assets/social-card.png",
]) {
  assert.ok(
    files.includes(join(root, name)),
    `Expected generated file: ${name}`,
  );
}
assert.ok(
  !files.includes(join(root, "feed.xml")),
  "Feed output must not be generated.",
);
assert.ok(
  !files.some((file) => /(^|\/)(writing|work|feed)(\/|\.|$)/.test(file.slice(root.length))),
  "No /writing/, /work/, or feed output may be generated.",
);
assert.ok(
  !files.some((file) => /draft|fixture|content-drafts/.test(file)),
  "Drafts and test fixtures must not be published.",
);
const css = await readFile(join(root, "assets/styles.css"), "utf8");
for (const [, path] of css.matchAll(/url\(['"]?(\/[^)'"\s]+)['"]?\)/g))
  await stat(join(root, path));
console.log(
  `Checked ${pages.length} HTML pages, ${links} internal links/anchors, static assets, metadata, and draft exclusion.`,
);
