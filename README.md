<a href="https://puppetflow.com"><img src="https://www.puppetflow.com/img/puppetflow-promo-banner.png" width="100%" alt="Puppetflow" /></a>

# Blueprints

Public blueprints collection of Puppetflow flows and snippets, consumed by the in-app store via GitHub.

## Structure

```
blueprints/
├── scaffold.js
└── blueprints/
    └── [service]/
        ├── metadata.json     # title, namespace, icon, author
        ├── icon.png          # 128×128 px
        ├── flows/
        │   └── [reference].js or [reference].json
        └── snippets/
            └── [reference].js or [reference].json
```

- **Service**: service or domain name (`salesforce`, `gmail`, `linkedin`...)
- **Namespace**: variable-style identifier, lowercase letters, digits, and underscores. It must not start with a digit.
- **Reference**: filename without `.js`, valid JS identifier (e.g. `scrapeProfile`)
- **Title**: `// @title` header in each flow/snippet file
- **Description**: `// @description` header in each flow/snippet file

## metadata.json

```json
{
  "title": "My Service",
  "namespace": "my_service",
  "description": "Short description shown in the store",
  "category": "scraping",
  "color": "green",
  "icon": "icon.png",
  "author": {
    "name": "Your name",
    "homepage": "https://yoursite.com"
  }
}
```

`author` and `color` are optional. `title`, `namespace`, `description`, `category`, and `icon` are required. `namespace` must match `^[a-z_][a-z0-9_]*$`. `category` must be one of: `auth`, `scraping`, `files`, `notifications`, `data`. `color` can be one of `green`, `blue`, `cyan`, `purple`, `pink`, `orange`, `amber`, `slate`, `white`, or a custom six-digit hex color such as `#ff4d8d`.

## Item headers

### Code flows and snippets

Every `.js` file must start with `@title` and include `@description` before the code:

```js
// @title Scrape LinkedIn profile data
// @description Extracts public profile details from a LinkedIn page.
// @input profileUrl [string]: "https://www.linkedin.com/in/example"
// @input includePosts [boolean]: true
// @input maxPosts [number]
async function run($page, $input) { ... }
```

### Nodal flows

Every Nodal `.json` flow must contain `metadata.title` and `metadata.description` before its graph:

```json
{
  "metadata": {
    "title": "Scrape LinkedIn profile data",
    "description": "Extracts public profile details from a LinkedIn page."
  },
  "graph": {
    "nodes": [],
    "edges": []
  }
}
```

### Flow inputs

Declare flow inputs in the leading comment header with:

```text
// @input name [type]: default
```

- `name` must be a valid JavaScript identifier.
- `type` must be `string`, `number`, `boolean`, `array`, `object`, `null`, `channel`, `mailbox-watcher`, or `ai-model`.
- The default value is optional. A `string` input without a default is imported as `""`; other types use `null`.
- String defaults can be plain text or JSON strings. Array and object defaults must be valid JSON.
- A `null` input accepts either no default or the explicit `null` value.
- Imported declarations are added automatically to the flow's **Flow Inputs**.
- Downloads regenerate these declarations from **Flow Inputs**. `${vars.KEY}` references are resolved before export, including secret variables available to the user downloading the flow. Resolved values are written to the downloaded file in plaintext.

Examples:

```js
// @input username [string]: "john@example.com"
// @input retries [number]: 3
// @input enabled [boolean]: true
// @input tags [array]: ["billing", "monthly"]
// @input options [object]: {"includeArchived": false}
// @input model [ai-model]
// @input password [string]
// @input optionalValue [null]: null
```

For a Nodal JSON flow, place the same definitions in `metadata.inputs`:

```json
{
  "metadata": {
    "title": "Example flow",
    "description": "Example Nodal flow.",
    "inputs": [
      {"name": "username", "type": "string", "default": "john@example.com"},
      {"name": "retries", "type": "number", "default": 3},
      {"name": "password", "type": "string"},
      {"name": "optionalValue", "type": "null", "default": null}
    ]
  },
  "graph": {
    "nodes": [],
    "edges": []
  }
}
```

## Commands

```bash
# Validate all blueprints (exit 1 on errors, hook into CI)
npm run validate

# Create a new service
npm run new:service <name>

# Add a flow or snippet to an existing service
npm run new:flow    <service> <reference>
npm run new:snippet <service> <reference>
```

## PR checklist

- [ ] Service name and reference in `kebab-case`
- [ ] `icon.png` provided (128×128 px)
- [ ] First line is a descriptive comment (`// ...`)
- [ ] No credentials or secrets in the code
- [ ] Tested before merge
- [ ] `npm run validate` passes with no errors
