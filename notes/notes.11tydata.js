const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default {
  layout: "note.njk",
  tags: ["note"],
  eleventyComputed: {
    // Obsidian conventions: the filename IS the title; URLs are slugged per segment.
    // notes/PRE charts 7 Max/BTN RFI.md -> /notes/pre-charts-7-max/btn-rfi/
    title: (data) => data.title || data.page.filePathStem.split("/").pop(),
    permalink: (data) =>
      data.page.filePathStem.split("/").filter(Boolean).map(slug).join("/") + "/",
  },
};
