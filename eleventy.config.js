export default function (config) {
  config.setNunjucksEnvironmentOptions({ autoescape: true });
  config.addPassthroughCopy({ "src/assets": "assets" });
  config.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });
  config.addFilter("readableDate", (value) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(value)),
  );
  config.addFilter("isoDate", (value) => new Date(value).toISOString());
  config.addFilter("readingTime", (text) =>
    Math.max(
      1,
      Math.ceil(
        String(text)
          .replace(/<[^>]+>/g, "")
          .split(/\s+/).length / 220,
      ),
    ),
  );
  config.addCollection("posts", (collection) =>
    collection
      .getFilteredByGlob("src/posts/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date),
  );
  config.addCollection("sitemap", (collection) =>
    collection
      .getAll()
      .filter(
        (item) =>
          !item.data.draft &&
          item.url &&
          item.url.endsWith("/") &&
          item.data.sitemap !== false,
      ),
  );
  // Keep tables semantic but let wide ones scroll inside their own region
  // instead of widening the page.
  config.addTransform("wrapTables", (content, outputPath) => {
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html"))
      return content;
    return content.replace(
      /<table\b[^>]*>[\s\S]*?<\/table>/g,
      (table) =>
        `<div class="table-scroll" role="region" tabindex="0" aria-label="Table">${table}</div>`,
    );
  });
  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
