import { defineField, defineType } from "sanity";

export const policy = defineType({
  name: "policy",
  title: "Policy Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title" },
      description: 'e.g. "privacy-policy", "shipping-policy", "returns-policy"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      initialValue: () => new Date().toISOString().split("T")[0],
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "title", date: "lastUpdated" },
    prepare({ title, date }) {
      return { title, subtitle: date ? `Last updated ${date}` : "" };
    },
  },
});
