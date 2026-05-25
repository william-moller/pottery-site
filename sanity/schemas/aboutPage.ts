import { defineField, defineType } from "sanity";

// Singleton — only one About page will ever exist
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  // Prevent creating more than one instance via the Studio UI
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "portrait",
      title: "Portrait Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
      description: "Your story — written in your own voice.",
    }),
    defineField({
      name: "artistStatement",
      title: "Artist Statement",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "pressMentions",
      title: "Press / Features (optional)",
      type: "array",
      of: [
        defineField({
          name: "mention",
          title: "Mention",
          type: "object",
          fields: [
            { name: "publication", title: "Publication", type: "string" },
            { name: "url", title: "Link (optional)", type: "url" },
            { name: "year", title: "Year", type: "number" },
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
