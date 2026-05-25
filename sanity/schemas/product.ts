import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
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
      of: [{ type: "block" }], // rich text
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.min(1).error("At least one photo is required."),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Bowls",  value: "bowls"  },
          { title: "Mugs",   value: "mugs"   },
          { title: "Vases",  value: "vases"  },
          { title: "Plates", value: "plates" },
          { title: "Other",  value: "other"  },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "drop",
      title: "Drop (leave empty for always-available)",
      type: "reference",
      to: [{ type: "drop" }],
      description: "Assign to a drop to enable the countdown + preview behaviour.",
    }),
    defineField({
      name: "active",
      title: "Active (visible on site)",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0",
      price: "price",
      active: "active",
    },
    prepare({ title, media, price, active }) {
      return {
        title,
        media,
        subtitle: `$${price}${active ? "" : " — hidden"}`,
      };
    },
  },
});
