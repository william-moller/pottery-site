import { defineField, defineType } from "sanity";

export const drop = defineType({
  name: "drop",
  title: "Drop (Scheduled Release)",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Drop Name",
      type: "string",
      description: 'e.g. "Spring Collection 2026"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Shown on the drop preview page to build anticipation.",
    }),
    defineField({
      name: "previewImage",
      title: "Preview Image",
      type: "image",
      options: { hotspot: true },
      description: "Hero image for the drop preview page.",
    }),
    defineField({
      name: "goesLiveAt",
      title: "Goes Live At",
      type: "datetime",
      description:
        "The exact date and time when items in this drop become purchasable. All times are UTC.",
      validation: (Rule) => Rule.required(),
    }),
    // Products are linked from the product side (product.drop = reference to this drop)
    // This keeps the schema clean and avoids circular references.
  ],
  preview: {
    select: {
      title: "name",
      goesLiveAt: "goesLiveAt",
      media: "previewImage",
    },
    prepare({ title, goesLiveAt, media }) {
      const date = goesLiveAt ? new Date(goesLiveAt).toLocaleDateString() : "No date set";
      return { title, media, subtitle: `Goes live: ${date}` };
    },
  },
});
