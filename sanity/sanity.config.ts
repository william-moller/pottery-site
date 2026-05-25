import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { product }   from "./schemas/product";
import { drop }      from "./schemas/drop";
import { post }      from "./schemas/post";
import { aboutPage } from "./schemas/aboutPage";
import { homePage }  from "./schemas/homePage";
import { policy }    from "./schemas/policy";

export default defineConfig({
  name: "pottery-studio",
  title: "Pottery Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singletons — only one of each
            S.listItem().title("Home Page").child(
              S.document().schemaType("homePage").documentId("homePage")
            ),
            S.listItem().title("About Page").child(
              S.document().schemaType("aboutPage").documentId("aboutPage")
            ),
            S.divider(),
            // Collections
            S.documentTypeListItem("product").title("Products"),
            S.documentTypeListItem("drop").title("Drops"),
            S.documentTypeListItem("post").title("Blog Posts"),
            S.divider(),
            S.documentTypeListItem("policy").title("Policy Pages"),
          ]),
    }),
    visionTool(), // lets you run GROQ queries in the Studio — useful during dev
  ],

  schema: {
    types: [product, drop, post, aboutPage, homePage, policy],
  },
});
