---
title: 节点
description:
---

# {% $markdoc.frontmatter.title %}


节点是 Markdoc 从 Markdown（具体来说是 [CommonMark 规范](https://commonmark.org/)）继承的元素。Markdoc 节点使您能够自定义文档的渲染方式，而无需使用任何自定义语法——它完全由 Markdown 组成。自定义节点让您能够逐步扩展实现。

## 内置节点

Markdoc 开箱即用，为每种 [CommonMark](https://commonmark.org/) 类型提供了内置节点：

{% table %}

- 节点类型
- 属性

---

- `document`
- [`frontmatter`](/docs/frontmatter)

---

- `heading`
- `level`

---

- `paragraph`
- —

---

- `hr`
- —

---

- `image`
- `src`

  `alt`

  `title`

---

- `fence`
- 
  {% table %}
  ---
  - `content`
  - 包含围栏内纯文本内容的字符串。
  ---
  - `language`
  - 用于对围栏内容进行语法高亮的编程语言。
  ---
  - `process`
  - 确定是否在围栏内解析 Markdoc 标签。设置 `process=false` 可将围栏内的内容视为纯文本。 
  {% /table %}

---

- `blockquote`
- —

---

- `list`
- `ordered`

---

- `item`
- —

---

- `table`
- —

---

- `thead`
- —

---

- `tbody`
- —

---

- `tr`
- —

---

- `td`
- `align`

  `colspan`
  
  `rowspan`

---

- `th`
- `align`

  `width`

---

- `inline`
- —

---

- `strong`
- —

---

- `em`
- —

---

- `s`
- —

---

- `link`
- `href`

  `title`

---

- `code`
- `content`

---

- `text`
- `content`

---

- `hardbreak`
- —

---

- `softbreak`
- —

---

- `error`
- —

{% /table %}


## 自定义 Markdoc 节点

您通过将自定义节点传递给 [`config` 对象](/docs/config) 来定义自定义节点，例如：

```js
import { heading } from './schema/Heading.markdoc';
import * as components from './components';

/** @type {import('@markdoc/markdoc').Config} */
const config = {
  nodes: {
    heading
  }
};

const ast = Markdoc.parse(doc);
const content = Markdoc.transform(ast, config);

const children = Markdoc.renderers.react(content, React, { components });
```

其中 `heading` 看起来像这样：

```js
// ./schema/Heading.markdoc.js

import { Tag } from '@markdoc/markdoc';

// 或者将其替换为您自己的函数
function generateID(children, attributes) {
  if (attributes.id && typeof attributes.id === 'string') {
    return attributes.id;
  }
  return children
    .filter((child) => typeof child === 'string')
    .join(' ')
    .replace(/[?]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export const heading = {
  children: ['inline'],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 }
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    const id = generateID(children, attributes);

    return new Tag(
      `h${node.attributes['level']}`,
      { ...attributes, id },
      children
    );
  }
};
```

注册此自定义节点后，您便可以在 Markdoc 中使用它，例如：

{% sideBySide %}

{% example %}

```md
#### 我的标题
```

{% /example %}

#### 我的标题

{% /sideBySide %}

## 选项

这些是可用于自定义 `Node` 的可选字段：

{% table %}

- 选项
- 类型
- 描述 {% width="40%" %}

---

- `render`
- `string`
- 要渲染的输出名称（例如，HTML 标签、React 组件名称）

---

- `children`
- `string[]`
- 确定哪些标签或节点类型可以渲染为此节点的子节点。用于模式验证。

---

- `attributes`
- `{ [string]: SchemaAttribute }`
- 确定可以传递给此节点的[值（及其类型）](/docs/attributes)。

---

- `transform`
- ```js
  (Ast.Node, ?Options) =>
    | RenderableTreeNode
    | RenderableTreeNode[]
    | null
  ```
- 自定义此节点的 Markdoc 转换函数，返回您希望最终渲染的自定义输出。这会在 [`transform` 步骤](/docs/render#transform) 中调用。

---

- `validate`
- ```js
  (Node, ?Options) => ValidationError[];
  ```
- 扩展 Markdoc 验证。这将验证内容是否符合验证要求，并在 [`validate` 步骤](/docs/render#validate) 中调用。

{% /table %}

## 后续步骤

- [创建自定义标签](/docs/tags)
- [使用注释自定义节点](/docs/syntax#annotations)
