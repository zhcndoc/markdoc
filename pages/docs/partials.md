---
title: 部分
description:
---

# {% $markdoc.frontmatter.title %}

Markdoc 使用部分（partials）来跨文档重用内容。一个独立的 Markdoc 文件存储内容，并通过 partial 标签引用。

以下是将 `header.md` 文件作为部分包含的示例。
{% example %}

```
{% partial file="header.md" /%}
```

{% /example %}

#### 注册部分

您通过将文件名映射到 [`config` 对象](/docs/config) 中的抽象语法树（AST）节点来定义部分。默认的 `partial` [标签](/docs/tags) 会查看此配置以包含正确的内容。

{% example %}

```js
/** @type {import('@markdoc/markdoc').Config} */
const config = {
  partials: {
    'header.md': Markdoc.parse(`# My header`)
  }
};

const doc = `
{% partial file="header.md" /%}
`;

const ast = Markdoc.parse(doc);

const content = Markdoc.transform(ast, config);
```

{% /example %}

如果您希望 `partial` 标签表现不同，可以在 `Config.tags` 中覆盖它。

#### 传递变量

部分就像其他任何标签一样，因此您可以将 [变量](/docs/variables) 作为 [属性](/docs/attributes) 传递给它们，例如：

{% example %}

```
{% partial file="header.md" variables={name: "My header name"} /%}
```

{% /example %}

并像在常规 Markdoc 文档中一样访问这些变量：

{% example %}

```
{% $name %}
```

{% /example %}
