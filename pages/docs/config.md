---
title: 配置对象
description: 使用配置对象将自定义内容传入渲染流程
---

# {% $markdoc.frontmatter.title %}

当您自定义 Markdoc 时，必须将自定义内容传入渲染流程。最常见的方式是在渲染的 [转换](/docs/render#transform) 阶段提供一个配置对象。

例如，创建一个配置对象，指定变量 `$version` 的值为 `"1.0"`。然后将其传递给 `transform` 函数。

{% example %}
```js
/** @type {import('@markdoc/markdoc').Config} */
const config = { variables: { version: "1.0" }};
const ast = Markdoc.parse("This is version {% $version %}");
const content = Markdoc.transform(ast, config);
const html = Markdoc.renderers.html(content);
```
{% /example %}

## 选项

此表格概述了可在配置对象中传递的各种选项。

{% table %}

- 键
- 类型
- 描述

---

- [`节点`](/docs/nodes)
- {% code %}{ [nodeType: [NodeType](/docs/nodes#built-in-nodes)]: [Schema](https://github.com/markdoc/markdoc/blob/60a2c831bd7ac8f2f24aabfde0b36e56e5d0dbe1/src/types.ts#L101-L109) }{% /code%}
- 在您的模式中注册 [自定义节点](/docs/nodes)

---

- [`标签`](/docs/tags)
- {% code %}{ [tagName: string]: [Schema](https://github.com/markdoc/markdoc/blob/60a2c831bd7ac8f2f24aabfde0b36e56e5d0dbe1/src/types.ts#L101-L109) }{% /code%}
- 在您的模式中注册 [自定义标签](/docs/tags)

---

- [`变量`](/docs/variables)
- `{ [variableName: string]: any }`
- 注册 [变量](/docs/variables) 以在文档中使用

---

- [`函数`](/docs/functions)
- {% code %}{ [functionName: string]: [ConfigFunction](https://github.com/markdoc/markdoc/blob/6bcb8a0c48a181ca9df577534d841280646cea09/src/types.ts#L31-L36) }{% /code %}
- 注册 [自定义函数](/docs/functions) 以在文档中使用

---

- [`部分`](/docs/partials)
- `{ [partialPath: string]: Ast.Node }`
- 注册可重用内容片段，供 [`partial` 标签](/docs/partials) 使用

{% /table %}

## 完整示例

以下是 Markdoc 配置的示例：

```js
/** @type {import('@markdoc/markdoc').Config} */
const config = {
  nodes: {
    heading: {
      render: 'Heading',
      attributes: {
        id: { type: String },
        level: { type: Number }
      }
    }
  },
  tags: {
    callout: {
      render: 'Callout',
      attributes: {
        title: {
          type: String
        }
      }
    }
  },
  variables: {
    name: 'Dr. Mark',
    frontmatter: {
      title: 'Configuration options'
    }
  },
  functions: {
    includes: {
      transform(parameters, config) {
        const [array, value] = Object.values(parameters);

        return Array.isArray(array) ? array.includes(value) : false;
      }
    }
  },
  partials: {
    'header.md': Markdoc.parse(`# My header`)
  }
};

const content = Markdoc.transform(ast, config);
```
