import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      description: "Full-width background image at the top of the page.",
    }),
    defineField({
      name: "heroTagline",
      title: "Hero Tagline",
      type: "string",
      description: 'e.g. "Handcrafted with intention."',
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (Rule) => Rule.max(6),
      description: "Up to 6 products shown on the homepage.",
    }),
    defineField({
      name: "upcomingDrop",
      title: "Upcoming Drop (teaser)",
      type: "reference",
      to: [{ type: "drop" }],
      description: "Shows a countdown teaser on the homepage. Remove once the drop is live.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
