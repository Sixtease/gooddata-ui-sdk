// (C) 2007-2025 GoodData Corporation
import { transformToTypescript } from "../transform/toTypescript.js";
import { format } from "prettier";
import { transform } from "@babel/core";

import * as fs from "fs";
import { WorkspaceMetadata } from "../base/types.js";

/**
 * Exports project metadata into javascript file containing sdk-model entity definitions (attribute, measure, etc)
 *
 * This is done by generating typescript code & then running it through babel plugin which strips away the
 * type annotations.
 *
 * @param projectMetadata - project metadata to export into javascript
 * @param outputFile - output typescript file - WILL be overwritten
 */
export async function exportMetadataToJavascript(
    projectMetadata: WorkspaceMetadata,
    outputFile: string,
): Promise<void> {
    const output = transformToTypescript(projectMetadata, outputFile);

    const generatedTypescript = output.sourceFile.getFullText();
    const formattedTypescript = await format(generatedTypescript, { parser: "typescript", printWidth: 120 });

    const javascript = transform(formattedTypescript, {
        plugins: ["@babel/plugin-transform-typescript"],
    });

    fs.writeFileSync(outputFile, javascript?.code ?? "", { encoding: "utf-8" });
}
