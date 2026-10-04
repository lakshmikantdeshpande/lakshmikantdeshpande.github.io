export default {
  layout: "layouts/post.njk",
  eleventyComputed: {
    permalink: (data) =>
      data.page.inputPath.endsWith("/index.njk")
        ? "/posts/"
        : data.draft
          ? false
          : `/posts/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) => !!data.draft,
  },
};
