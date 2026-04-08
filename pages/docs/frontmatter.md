---
title: 前置元数据
description:
---

# {% $markdoc.frontmatter.title %}

使用前置元数据为 Markdoc 文档应用页面级元数据，例如 `title` 和 `description`。Markdoc 不关心你如何格式化前置元数据，你可以使用 YAML、TOML、JSON、GraphQL——几乎任何你想要的数据格式。

## 示例

虽然并非详尽列表，但以下示例能让你了解如何以各种格式构建前置元数据。

### YAML

```yaml
---
title: 在 Markdoc 中创作
description: 使用 Markdoc 语法（Markdown 的超集）快速创作精彩内容。
date: 2022-04-01
---
```

### TOML

```toml
---
title       = "在 Markdoc 中创作"
description = "使用 Markdoc 语法（Markdown 的超集）快速创作精彩内容。"
date        = "2022-04-01"
---
```

### JSON

```json
---
{
  "title": "在 Markdown 中创作",
  "description": "使用 Markdoc 语法（Markdown 的超集）快速创作精彩内容。",
  "date": "2022-04-01"
}
---
```

### GraphQL

```graphql
---
{
  page {
    title
    description
    date
  }
}
---
```

## 访问前置元数据值

要访问文档中的前置元数据内容，必须将值作为 [变量](/docs/variables) 传递给 Markdoc。

### 解析文档

解析文档以访问前置元数据内容：

{% example %}

```js
const doc = `
---
title: 我的标题
---

# {% $frontmatter.title %} 
`;
```

{% /example %}

### 解析前置元数据

使用你喜欢的格式解析前置元数据属性，并将其传递到 [`config` 对象](/docs/config) 的 `variables` 字段中。

```js
import yaml from 'js-yaml'; // 或 'toml' 等

const frontmatter = ast.attributes.frontmatter
  ? yaml.load(ast.attributes.frontmatter)
  : {};

/** @type {import('@markdoc/markdoc').配置} */
const config = {
  variables: {
    frontmatter
  }
};
```

### 使用前置元数据值

将解析后的前置元数据传递给 `variables` 后，您可以使用 `$frontmatter` 访问这些值：

{% sideBySide %}

{% example %}

```md
# {% $frontmatter.title %}
```

{% /example %}

# {% $markdoc.frontmatter.title %}

{% /sideBySide %}
