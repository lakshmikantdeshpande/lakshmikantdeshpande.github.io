import { rm } from "node:fs/promises";
// Only the generated output, resolved relative to this script, is disposable.
await rm(new URL("../_site/", import.meta.url), {
  recursive: true,
  force: true,
});
