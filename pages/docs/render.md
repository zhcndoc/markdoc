---
title: 渲染阶段
description:
---

# {% $markdoc.frontmatter.title %}

Markdoc 有三个渲染阶段：`parse`、`transform` 和 `render`。每个阶段都基于前一阶段的输出进行操作。

Markdoc 还包含一个 `validate` 函数，您可以单独运行它（独立于渲染阶段）来确认 Markdoc 文档是否有效。  
有关更多信息，请参阅[验证文档](/docs/validation)。

{% diagram type="flowchart" /%}

## 解析

```ts
parse(string) => AstNode
```

解析将原始字符串转换为表示您的 Markdoc 文档的[抽象语法树 (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。AST 包含关于您内容的信息，包括文档中每个内容片段的位置。

一个 AST 示例可能如下所示：

```json
{
  "type": "document",
  "attributes": {},
  "children": [
    {
      "type": "paragraph",
        "attributes": {},
        "children": [...],
        "lines": [0, 2],
        "location": {
          "start": {
            "line": 0
          },
          "end": {
            "line": 2
          }
        },
        "errors": [],
        "inline": false,
    }
  ],
  "lines": [],
  "errors": [],
  "inline": false
}
```

您可以在[开发者游乐场](/sandbox?mode=ast)中亲自查看。

AST 节点实例还包含一些有用的函数，例如 `walk`，它对于遍历和修改 AST 很有用。

```js
const ast = Markdoc.parse(document);

for (const node of ast.walk()) {
  // 对每个节点执行某些操作
}
```

## 转换

```ts
transform(AstNode | AstNode[], ?Config) => RenderableTreeNode | RenderableTreeNode[]
```

转换接收一个抽象语法树，并将其转换为可渲染树，这是最终渲染内容的可序列化中间表示。该对象对于计算诸如[目录](/docs/examples#table-of-contents)之类的内容，或通过网络传递给客户端非常有用。

转换步骤还负责将变量解析为静态标量值（字符串、布尔值、对象等）。

一个可渲染树示例可能如下所示：

```json
{
  "name": "article",
  "attributes": {},
  "children": [
    {
      "name": "h1",
      "attributes": {},
      "children": ["Header"],
      "$$mdtag": true
    }
  ],
  "$$mdtag": true
}
```

您可以在[开发者游乐场](/sandbox?mode=transform)中查看更高级的可渲染树。

## 渲染

渲染接收一个可渲染树，并将其转换为渲染输出。对于 `html`，这意味着将 HTML 文档创建为字符串。对于 `react`，这意味着创建一个 [React 元素](https://reactjs.org/docs/render-elements.html)。

您可以通过创建一个接收可渲染树作为参数并返回所需输出的函数来创建自己的渲染器。

一个 `html` 输出示例可能如下所示：

```html
<h1>Getting started</h1>

<p>Run this command to install the Markdoc library:</p>
```

### React

```ts
renderers.react(RenderableTreeNode | RenderableTreeNode[]) => React.Node
```

Markdoc 开箱即用地支持渲染 [React](https://reactjs.org/)。您可以在[开发者游乐场](/sandbox?mode=preview)中查看 React 渲染器的实际效果。

\
要渲染 React，首先通过调用 `transform` 从文档创建可渲染树。您可以在服务器或客户端上执行此操作。

{% example %}

```js
const tags = {
  callout: {
    render: 'Callout',
    attributes: {}
  }
};

const doc = `
{% callout %}
Attention, over here!
{% /callout %}
`;

const ast = Markdoc.parse(doc);
const content = Markdoc.transform(ast, { tags });
```

{% /example %}

\
然后，使用来自客户端应用程序的可渲染树调用 `Markdoc.renderers.react`。除了 `content` 和 `React` 之外，您还需要提供 `components` 对象作为参数。`components` 对象指定了从您的标签和节点到相应 React 组件的映射。

{% sideBySide %}

```jsx
import Markdoc from '@markdoc/markdoc';
import React from 'react'; // 或 'preact'

function Callout({ children }) {
  return <div className="callout">{children}</div>;
}

function MyApp() {
  return Markdoc.renderers.react(content, React, {
    components: {
      Callout: Callout
    }
  });
}
```

{% item %}

#### 渲染输出

{% callout %}
注意，在这里！
{% /callout %}
{% /item %}

{% /sideBySide %}

### HTML

```ts
renderers.html(RenderableTreeNode | RenderableTreeNode[]) => string
```

Markdoc 开箱即用地支持渲染 HTML。由于 HTML 渲染器将 HTML 文档输出为字符串，您无需额外配置即可使用 [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)。

\
要渲染 HTML，首先通过调用 `transform` 从内容创建可渲染树：

{% example %}

```js
const doc = `
# Getting started

Run this command to install the Markdoc library:
`;

const ast = Markdoc.parse(doc);
const content = Markdoc.transform(ast);
```

{% /example %}

\
然后，使用您的可渲染树调用 `Markdoc.renderers.html`，这将创建相应的 HTML 文档。

{% sideBySide %}

```js
const express = require('express');
const Markdoc = require('@markdoc/markdoc');

const app = express();

app.get('/docs/getting-started', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        ${Markdoc.renderers.html(content)}
      </body>
    </html>
  `);
});
```

{% item %}

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Getting started</h1>
    <p>Run this command to install the Markdoc library:</p>
  </body>
</html>
```

{% /item %}

{% /sideBySide %}

### 创建自己的渲染器

由于 Markdoc 渲染器是常规函数，您可以根据自己的用例需求创建自定义渲染器。  
尝试为 [Vue](https://vuejs.org/)、[Svelte](https://svelte.dev/)、[Spectacle](https://formidable.com/open-source/spectacle/) 或任何您能想到的其他框架创建自己的渲染器。

## 后续步骤

- [验证您的内容](/docs/validation)
- [查看常见示例](/docs/examples)
- [快速构建文档站点](/docs/nextjs)
