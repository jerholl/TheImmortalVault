import {defineConfig} from "sanity";
import {deskTool} from "sanity/desk";
import {schemaTypes} from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "replace-me";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "The Immortal Vault Studio",
  projectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes
  }
});
