---
title: 将 Markdoc 与 React 结合使用
---

# {% $markdoc.frontmatter.title %}

Markdoc 支持 [开箱即用地渲染 Markdoc 语法与 React](/docs/render#react)。

要开始使用 React，请查看 [此示例仓库](https://github.com/markdoc/docs/tree/main/examples/react-nodejs)，了解如何将 Markdoc 与 [`create-react-app`](https://create-react-app.dev/) 和 [`express`](https://expressjs.com/) 结合使用。

## 设置

请按照以下步骤，使用 [`create-react-app`](https://create-react-app.dev/) 和 [`express`](https://expressjs.com/) 构建 Markdoc 应用。

1. 遵循 [`create-react-app` 入门步骤](https://create-react-app.dev/docs/getting-started) 创建初始应用
2. 设置 Markdoc 架构

   ```shell
   schema/
   ├── Callout.markdoc.js
   └── heading.markdoc.js
   ```

   ```js
   // [schema/Callout.markdoc.js](https://github.com/markdoc/docs/blob/dcba1a62be92097e3fd50c21e05fd6d2ea709312/examples/react-nodejs/schema/Callout.markdoc.js#L1-L18)

   module.exports = {
     render: 'Callout',
     children: ['paragraph', 'tag', 'list'],
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
   // [schema/heading.markdoc.js](https://github.com/markdoc/docs/blob/dcba1a62be92097e3fd50c21e05fd6d2ea709312/examples/react-nodejs/schema/heading.markdoc.js#L1-L22)

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

3. 在服务器上解析 Markdoc 文档

   ```js
   // [...](https://github.com/markdoc/docs/blob/main/examples/react-nodejs/createContentManifest.js#L13)
   const rawText = fs.readFileSync(file, 'utf-8');
   const ast = Markdoc.parse(rawText);
   ```

4. 在服务器上调用 `Markdoc.transform`

   ```js
   // [server.js](https://github.com/markdoc/docs/blob/main/examples/react-nodejs/server.js)

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

     return res.json(content);
   });

   app.listen(4242, () => {
     console.log(`Example app listening on port ${4242}`);
   });
   ```

5. 在客户端调用 `Markdoc.renderers.react`

   ```js
   // src/App.js

   import React from 'react';
   import Markdoc from '@markdoc/markdoc';

   import { Callout } from './Callout';

   export default function App() {
     const [content, setContent] = React.useState(null);

     React.useEffect(() => {
       (async () => {
         const response = await fetch(
           `/markdoc?` +
             new URLSearchParams({ path: window.location.pathname }),
           { headers: { Accept: 'application/json' } }
         );

         if (response.status === 404) {
           setContent('404');
           return;
         }

         const content = await response.json();
         setContent(content);
       })();
     }, []);

     if (content === '404') {
       return <p>Page not found.</p>;
     }

     if (!content) {
       return <p>Loading...</p>;
     }

     const components = {
       Callout
     };

     return Markdoc.renderers.react(content, React, { components });
   }
   ```

6. 启动客户端和服务器
   ```shell
   npm run start:client
   ```
   以及
   ```shell
   npm run start:server
   ```

\
或者，克隆 [此初始仓库](https://github.com/markdoc/docs/tree/main/examples/react-nodejs) 并遵循 [README](https://github.com/markdoc/docs/tree/main/examples/react-nodejs/README.md) 中的说明操作。
