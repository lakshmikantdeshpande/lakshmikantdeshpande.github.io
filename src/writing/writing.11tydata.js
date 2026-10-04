export default {
  layout: "layouts/post.njk",
  eleventyComputed: {
    permalink: (data) =>
      data.page.inputPath.endsWith("/index.njk")
        ? "/writing/"
        : data.draft
          ? false
          : `/writing/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) => !!data.draft,
  },
};
