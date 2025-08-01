---
trigger: model_decision
description: Git commit conventions
globs:
---

# Commit Conventions

Commits must follow the [Conventional Commits](mdc:https:/www.conventionalcommits.org/en/v1.0.0) specification with the following structure:

```
<type>: <description>

<body>

risk: <risk-flag>
JIRA: <ticket-number>
<footer>
```

## Type

Must be one of the following:

-   `feat` - A new feature
-   `fix` - A bug fix of existing feature
-   `build` - Changes that affect the build system or auxiliary tools and libraries
-   `ci` - Changes to CI configuration files and scripts
-   `docs` - Documentation changes, JSDoc, comments, changelog
-   `perf` - A code change that improves performance
-   `style` - Changes that do not affect the meaning of the code (white-space, formatting)
-   `refactor` - A code change that neither fixes a bug nor adds a feature
-   `test` - Adding new tests or correcting existing tests
-   `chore` - Change of code that do not fit anything described above
-   `config` - Code change adjusting environment or tooling configuration
-   `trivial` - Simple, low-risk code change, not bringing a new functionality

## Scope

The scope should be the name of the affected package (e.g. `sdk-backend-spi`, `sdk-model`, `sdk-ui`, etc).
You can omit scope for changes that are done across all packages.

## Description

A short description of the change:

-   Should be preferably 50 characters long or less
-   Should be entirely in lowercase except for proper nouns, acronyms, and code references
-   Should not end with a period

## Body

A detailed description of the commit, expanding on the short description.
Lines must be wrapped at 72 characters.

## Footer

The commit must include a footer:

1. JIRA ID reference in the format `JIRA: PROJECT-TICKET_ID` (e.g., `JIRA: RAIL-2175`)

    - For changes not requiring a JIRA ticket, use `JIRA: TRIVIAL` or omit this line

2. Risk assessment in the format `risk: [nonprod|low|high]` (e.g., `risk: low`)

## Example

```
feat(sdk-model): attribute area sort

-  the attribute sort aggregation switches the attribute sort into
   area sort
-  having a 'flag' or 'aggregation' on a newAttributeSort factory seemed
   confusing while I tried to explain this in docs
-  it is more clear if the area sort has separate factory - even if it
   creates the same type.
-  but this way, the intent is cleaner
-  also, the aggregation: boolean was not good, this is indeed a function that may one day support more

risk: low
JIRA: RAIL-2175
```
