---
trigger: model_decision
description: Installing and building packages in this repository
globs:
---

## GoodData.UI SDK Build Rules

### Build Environment Setup

-   The repository uses [Rush](mdc:https:/rushjs.io) for monorepo management
-   Node.js version is specified in `.nvmrc` - use nvm to manage Node.js versions
-   Initial setup requires:
    ```bash
    nvm install
    nvm use
    npm i -g @microsoft/rush
    rush install
    rush build
    ```

### Build Commands

-   **Full build**: `rush build` - builds all packages in the correct dependency order
-   **Rebuild everything**: `rush clean && rush rebuild` - complete clean build
-   **Build a specific package with dependencies**: `rush build -t @gooddata/package-name`
-   **Build just one package**: `cd libs/package-name && rushx build`
-   **Clean build artifacts**: `rush clean`
-   **Delete all node_modules**: `rush purge`
-   **After pulling latest changes**: `rush install && rush build`
-   **For large changes**: `rush clean && rush purge && rush install && rush rebuild`

### Build Configuration

-   Each package has a `build` script in its `package.json`
-   Most packages use TypeScript for compilation with `tsc -p tsconfig.json`
-   UI packages with styles use `sass` for SCSS compilation
-   Packages use `api-extractor` to generate API documentation and type definitions
-   Build outputs ESM modules to the `esm` directory

### Build System Architecture

-   The build system is configured with rush-project.json files
-   Incremental builds are supported with build caching
-   Output directories are configured in rush-project.json:
    ```json
    {
        "operationSettings": [
            {
                "operationName": "build",
                "outputFolderNames": ["esm", "styles/css"]
            }
        ]
    }
    ```

### CI/CD Build Process

-   CI builds are managed through GitHub Actions workflows
-   CI builds execute the same `rush build` command as local development
-   CI enforces validation with `rush validate-ci`
-   Build cache is warmed up in CI to improve build performance

### Dependency Management

-   Add dependencies with `rush add -p <package>@^<version> --make-consistent`
-   Never add packages with npm/yarn/pnpm directly
-   Dependencies should use caret versioning (`^`) with rare exceptions
-   After adding dependencies, run `rush update` to update the lockfile
