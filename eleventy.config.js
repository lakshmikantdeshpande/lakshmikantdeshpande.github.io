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
      .getFilteredByGlob("src/writing/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date),
  );
  config.addCollection("projects", (collection) =>
    collection
      .getFilteredByGlob("src/work/*.md")
      .sort((a, b) => a.data.order - b.data.order),
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
  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
