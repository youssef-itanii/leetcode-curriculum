import fsPromises from "node:fs/promises";
import path from "node:path";

import type { Goody } from "../../../app/goodyParser";

export const GOODIES_DIRECTORY = path.join("goodies", "python");

export async function readBasicGoody(name: string): Promise<Goody> {
  const code = await fsPromises.readFile(
    path.join(GOODIES_DIRECTORY, name, "__init__.py"),
    "utf8",
  );

  return {
    code,
    globalModuleDeclarations: [],
    importedBy: [],
    imports: [],
    name,
  };
}
