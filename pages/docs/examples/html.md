---
title: 将 Markdoc 与 HTML 和 Web Components 结合使用
---

# {% $markdoc.frontmatter.title %}

Markdoc 支持使用 HTML 渲染器将 Markdoc 语法渲染为 HTML。

要开始使用 HTML 渲染器，请查看[此示例仓库](https://github.com/markdoc/docs/tree/main/examples/html-nodejs)，了解如何将 Markdoc 与 [`express`](https://expressjs.com/) 和 [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 结合使用。您可以在不使用 Web Components 的情况下使用 HTML 渲染器来转换和渲染 HTML，但我们建议使用 Web Components 来组织和封装自定义 Markdoc 组件的功能。

## 设置

本指南假设您已安装 `Express` 应用。如果您是从零开始，请遵循[这些说明安装 Express](https://expressjs.com/en/starter/installing.html) 并创建应用。

1. 设置 Markdoc 模式。

   ```shell
   schema/
   ├── Callout.markdoc.js
   └── heading.markdoc.js
   ```

   ```js
   // [schema/Callout.markdoc.js](https://github.com/markdoc/docs/blob/main/examples/html-nodejs/schema/Callout.markdoc.js)

   module.exports = {
     render: 'markdoc-callout',
     children: ['paragraph'],
     attributes: {
       type: {
         type: String,
         default: 'note',
         matches: ['check', 'error', 'note', 'warning']
       }
     }
   };
   ```

   ```js
   // [schema/heading.markdoc.js](https://github.com/markdoc/docs/blob/main/examples/html-nodejs/schema/heading.markdoc.js)

   const { nodes } = require('@markdoc/markdoc');

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

   module.exports = {
     ...nodes.heading,
     transform(node, config) {
       const base = nodes.heading.transform(node, config);
       base.attributes.id = generateID(base.children, base.attributes);
       return base;
     }
   };
   ```

2. 为任何自定义标签定义组件。由于 `heading` 是核心 Markdown [节点](/docs/nodes)，Markdoc 已经知道如何使用 CommonMark 规范渲染它。`Callout` 需要组件，因为它是自定义标签。我们在示例中使用了 [`lit`](https://lit.dev/docs/) 来为 `markdoc-callout` 元素定义 Web Component。

   ```js
   // [src/Callout.js](https://github.com/markdoc/docs/blob/main/examples/html-nodejs/src/Callout.js)

   import { html, css, LitElement } from 'lit';

   export class MarkdocCallout extends LitElement {
     static styles = css`
       .note {
         background-color: #8792a2;
       }
       .caution {
         background-color: #d97917;
       }
       .check {
         background-color: #000000;
       }
       .warning {
         background-color: #ed5f74;
       }
     `;

     static properties = {
       type: { type: String }
     };

     constructor() {
       super();
       this.type = 'note';
     }

     render() {
       return html`<p class="${this.type}"><slot></slot></p>`;
     }
   }
   ```

3. 在服务器上解析 Markdoc 文档，以创建路由和 Markdoc 内容的地图。我们称之为“内容清单”，它在请求期间用于返回路由的正确 Markdoc 内容。

   ```js
   // [...](https://github.com/markdoc/docs/blob/main/examples/html-nodejs/createContentManifest.js#L19-L20)
   const rawText = fs.readFileSync(file, 'utf-8');
   const ast = Markdoc.parse(rawText);
   ```

4. 在服务器上使用自定义标签、节点以及您希望 Markdoc 内容访问的任何变量的配置调用 `Markdoc.transform`。然后，使用 HTML Markdoc 渲染器 (`Markdoc.renderers.html`) 将转换后的内容渲染为 HTML 以显示给用户。

   ```js
   // [server.js](https://github.com/markdoc/docs/blob/main/examples/html-nodejs/server.js#L47)

   const express = require('express');

   const app = express();

   const callout = require('./schema/callout.markdoc');
   const heading = require('./schema/heading.markdoc');

   // [...](https://github.com/markdoc/docs/blob/dcba1a62be92097e3fd50c21e05fd6d2ea709312/examples/react-nodejs/server.js#L8-L14)

   app.get('/markdoc', (req, res) => {
     const ast = contentManifest[req.query.path];

     const config = {
       tags: {
         callout
       },
       nodes: {
         heading
       },
       variables: {}
     };

     const content = Markdoc.transform(ast, config);
     const rendered = Markdoc.renderers.html(content) || '';
     const html = TEMPLATE.replace(/{{ CONTENT }}/, rendered);
     return res.send(html);
   });

   app.listen(4242, () => {
     console.log(`Example app listening on port ${4242}`);
   });
   ```

5. 确保在客户端包含任何打包的脚本（在本例中为 `main.js`）与您的自定义组件。此示例使用简单的 HTML 模板注入 Markdoc 内容，但您可以使用其他模板引擎（例如：Pug、Handlebars 等）来为您管理此内容注入。

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <meta name="description" content="使用 Markdoc 创建的网站" />
       <title>Markdoc：创建 HTML 示例</title>
     </head>
     <body>
       {{ CONTENT }}
       <script src="./main.js"></script>
     </body>
   </html>
   ```

6. 启动演示应用。
   ```shell
   npm run build
   ```
   和
   ```shell
   npm run start
   ```
