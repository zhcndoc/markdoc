---
title: 标签
description: 使用标签扩展 Markdown。通过标签，您可以使用原生 Markdoc 组件或自定义 React 组件。
---

# {% $markdoc.frontmatter.title %}

标签是标准 Markdown 的语法扩展。您可以使用原生 Markdoc 标签，如 [表格](#table)、[条件语句](#if/else) 和 [部分引用](#partial)，或创建自定义 React 组件。

与 React 组件和 HTML 元素类似，标签是可组合的，您可以使用 [属性](/docs/attributes) 自定义它们。

{% example %}

```md
{% if true %}

{% callout type="note" %}
Tags are composable!
{% /callout %}

{% else /%}

{% callout type="warning" %}
Tags aren't composable!
{% /callout %}

{% /if %}
```
{% /example %}

标签可以自闭合（类似于 HTML）。在此示例中，您会看到内容主体被移除，并且标签以 `/` 闭合。

{% example %}

```
{% image width=40 /%}
```

{% /example %}

如果您的标签不包含任何换行符，则将其视为内联标签。内联标签会自动包装在一个 `paragraph` [节点](/docs/nodes) 中（默认渲染为 `<p>` 元素），以遵循 [CommonMark 段落规范](https://spec.commonmark.org/0.30/#paragraphs)。

{% example %}

```
{% code %}

{% highlight %}Inline tag 1{% /highlight %}
{% highlight %}Inline tag 2{% /highlight %}

{% /code %}
```

{% /example %}

## 内置标签

Markdoc 开箱即用，提供四个内置标签：`if`、`else`、`table` 和 `partial`。

### 条件语句

当满足特定条件时，使用 `{% if %}` 和 `{% else /%}` 标签动态渲染内容。Markdoc 将条件语句与 [变量](/docs/syntax#variables) 和 [函数](/docs/functions) 结合使用。

{% callout type="warning" %}
与 JavaScript 不同，Markdoc 仅将 `undefined`、`null` 和 `false` 视为假值。
{% /callout %}

使用 `if` 标签在条件求值为 `true` 时渲染内容。

{% example %}

```
This is shown no matter what.

{% if $myFunVar %}
Only appear if $myFunVar!
{% /if %}
```

{% /example %}

使用 `else` 标签在 `if` 条件不满足时渲染替代内容。您可以使用多个 `else` 语句，当其他条件均不满足时，最后一个 `else` 标签触发。

{% example %}

```
{% if $myFunVar %}
Only appear if $myFunVar!
{% else /%}
This appears if not $myFunVar!
{% /if %}

{% if $myFunVar %}
Only appear if $myFunVar!
{% else $otherFunVar /%}
This appears if not $myFunVar and $otherFunVar!
{% else /%}
This appears if not $myFunVar and not $otherFunVar
{% /if %}
```

{% /example %}

### 表格

虽然 Markdoc 支持 [CommonMark](https://commonmark.org/) 表格，但它也支持基于列表的语法，可以轻松注入丰富内容，如项目符号列表和代码示例。

#### 基本表格

基本的 Markdoc 表格使用列表语法，每行由三个破折号 `---` 分隔。

{% example %}

```
{% table %}
* Heading 1
* Heading 2
---
* Row 1 Cell 1
* Row 1 Cell 2
---
* Row 2 Cell 1
* Row 2 cell 2
{% /table %}
```

{% /example %}

#### 带丰富内容的表格

Markdoc 表格支持富文本，包括代码示例和列表。

{% example %}

````
{% table %}
* Foo
* Bar
* Baz
---
*
  ```
  puts "Some code here."
  ```
*
  {% list type="checkmark" %}
  * Bulleted list in table
  * Second item in bulleted list
  {% /list %}
* Text in a table
---
*
  A "loose" list with

  multiple line items
* Test 2
* Test 3
---
* Test 1
* A cell that spans two columns {% colspan=2 %}
{% /table %}
````

{% /example %}

#### 无表头的表格

{% example %}

```
{% table %}
---
* foo
* bar
---
* foo
* bar
{% /table %}
```

{% /example %}

#### 设置列和行跨度

显式设置列和行跨度。

{% example %}

```
{% table %}
---
* foo
* bar
---
* foo {% colspan=2 %}
{% /table %}
```

{% /example %}

#### 文本对齐

{% example %}

```
{% table %}
* Column 1 {% align="center" %}
* Column 2
* Column 3 {% align="right" %}
---
* foo
* bar
* baz
---
* foo
* bar {% align="right" %}
* baz
---
* foo {% align="center" %}
* bar
* baz
{% /table %}
```

{% /example %}

#### 表格注意事项

Markdoc 使用 `table` 标签来定位将 Markdown 列表语法解析为表格的位置，但它使用 `table` [节点](/docs/nodes) 来渲染实际的表格元素。要自定义默认 `table` 的渲染方式，您需要注册一个自定义表格 _节点_。

{% example %}

```js
import { nodes } from '@markdoc/markdoc';

/** @type {import('@markdoc/markdoc').Config} */
const config = {
  nodes: {
    table: {
      ...nodes.table,
      render: 'Table' // your custom component goes here
    }
  }
};
```

{% /example %}

### 部分引用

Markdoc 使用部分引用来跨文档重用内容。内容存储在单独的 markdown 文件中，并通过 `partial` 标签中的 `file` 属性引用，该属性包含相应的内容片段。

以下示例包含 `header.md` 文件作为部分引用。
{% example %}

```
{% partial file="header.md" /%}
```

{% /example %}

有关部分引用的更多信息，请查看完整的 [部分引用文档](/docs/partials)。

## 创建自定义标签

要使用自定义标签扩展 Markdoc，首先创建标签定义。在此示例中，您正在创建 `callout` 标签：

```js
// ./schema/Callout.markdoc.js

export const callout = {
  render: 'Callout',
  children: ['paragraph', 'tag', 'list'],
  attributes: {
    type: {
      type: String,
      default: 'note',
      matches: ['caution', 'check', 'note', 'warning'],
      errorLevel: 'critical'
    },
    title: {
      type: String
    }
  }
};
```

然后，将标签定义传递给您的 [`config` 对象](/docs/config)：

```js
import { callout } from './schema/Callout.markdoc';
import * as components from './components';

/** @type {import('@markdoc/markdoc').Config} */
const config = {
  tags: {
    callout
  }
};

const doc = `
# My first custom tag
`;

const ast = Markdoc.parse(doc);
const content = Markdoc.transform(ast, config);

const children = Markdoc.renderers.react(content, React, { components });
```

接下来，将您的内容传递给 Markdoc 渲染器。如果要渲染 React 组件，请在 `components` 映射中指定应渲染此类型标签的组件。

```jsx
import * as React from 'react';
import { Icon } from './Icon';

function Callout({ title, icon, children }) {
  return (
    <div className="callout">
      <div className="content">
        <Icon icon={icon} />
        <div className="copy">
          <span className="title">{title}</span>
          <span>{children}</span>
        </div>
      </div>
    </div>
  );
}

return Markdoc.renderers.react(content, React, {
  components: {
    // The key here is the same string as `tag` in the previous step
    Callout: Callout
  }
});
```

现在您可以在 Markdoc 内容中使用自定义标签。

{% sideBySide %}

{% example %}

```md
{% callout title="Hey you!" icon="note" %}
I have a message for you
{% /callout %}
```

{% /example %}

{% callout title="嘿，你！" type="note" %}
我有消息要告诉你
{% /callout %}

{% /sideBySide %}

## 选项

这些是可用于自定义 `Tag` 的可选字段：

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
- 指定哪些节点类型可以渲染为此标签的子项。用于模式验证。

---

- `attributes`
- `{ [string]: SchemaAttribute }`
- 指定可以传递给此标签的 [值（及其类型）](/docs/attributes)。

---

- `transform`
- ```js
  (Ast.Node, ?Options) =>
    | RenderableTreeNode
    | RenderableTreeNode[]
    | null
  ```
- 自定义此标签的 Markdoc 转换函数，返回您最终想要渲染的自定义输出。这将在 [`transform` 步骤](/docs/render#transform) 中调用。

---

- `validate`
- ```js
  (Node, ?Options) => ValidationError[];
  ```
- 扩展 Markdoc 验证。用于验证内容是否符合验证要求。这将在 [`validate` 步骤](/docs/render#validate) 中调用。

---

- `selfClosing`
- `boolean`
- 指定标签是否可以包含子项（`false`）或不包含（`true`）。用于模式验证。

{% /table %}

## 后续步骤

- [使用属性自定义标签](/docs/attributes)
- [创建自定义函数](/docs/functions)
