---
title: 在 Next.js 中使用 Markdoc
description: 了解如何将 Markdoc 集成到 Next.js 项目中。
---

# {% $markdoc.frontmatter.title %}

使用 `@markdoc/next.js` 包/插件，您可以在 Next.js 应用中创建自定义的 `.md` 和 `.mdoc` 页面，并自动使用 Markdoc 渲染它们。

要立即开始，请查看[此入门仓库](https://github.com/markdoc/markdoc-starter)。部署自己版本的最快方式是通过点击下面的按钮，使用 [Vercel](https://vercel.com/) 或 [Netlify](https://www.netlify.com/) 进行部署。

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/markdoc/markdoc-starter) [![部署到 Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/markdoc/markdoc-starter)

## 设置

本指南假设您已经安装了 Next.js。如果您从零开始，请遵循这些[Next.js 入门步骤](https://nextjs.org/docs)。

\
请按照以下步骤开始使用 `@markdoc/next.js`。

1. 安装 `@markdoc/next.js` 和 `@markdoc/markdoc`：
   ```shell
   npm install @markdoc/next.js @markdoc/markdoc
   ```
2. 更新您的 `next.config.js`

   ```js
   const withMarkdoc = require('@markdoc/next.js');

   module.exports = withMarkdoc(/* [选项](#options) */)({
     pageExtensions: ['md', 'mdoc', 'js', 'jsx', 'ts', 'tsx']
   });
   ```

3. 在 `/pages/` 目录中创建一个新的 `.md` 文件，例如 `getting-started.md`

   ```
   pages
   ├── _app.js
   ├── docs
   │   └── getting-started.md
   └── index.md
   ```

4. 向您的文件添加一些 Markdoc 内容：

   ```
   ---
   title: 开始使用 Markdoc
   description: 如何开始使用 Markdoc
   ---

   # 开始使用 Markdoc
   ```

\
或者，克隆[此入门仓库](https://github.com/markdoc/markdoc-starter)并遵循[README](https://github.com/markdoc/markdoc-starter/blob/main/README.md)中的说明。

## 选项

您可以将选项传递给 `withMarkdoc` 以调整插件的行为。

{% table %}

- 选项
- 类型
- 描述

---

- `schemaPath`
- `string`
- Markdoc schema 文件夹的路径。请参阅[schema 自定义](#schema-customization)。

---

- `mode`
- `'static' | 'server'`
- 确定生成的 Markdoc 页面使用 [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching/get-static-props) 还是 [`getServerSideProps`](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props)。

{% /table %}

例如，以下如何将 `mode` 设置为 `static`，以便在构建时使用 `getStaticProps` 返回的 props 预渲染页面：

```js
module.exports = withMarkdoc({ mode: 'static' })({
  pageExtensions: // [自定义页面扩展](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions)
});
```

## Schema 自定义

您可以通过在项目根目录创建 `/markdoc/` 目录来定义 Markdoc schema。在此目录中定义自定义 [节点](/docs/nodes)、[标签](/docs/tags)和[函数](/docs/functions)。

```
.
├── components
│   ├── ...
│   └── Link.js
├── markdoc
│   ├── functions.js
│   ├── nodes
│   │   ├── ...
│   │   ├── link.markdoc.js
│   │   └── index.js
│   └── tags
│       ├── ...
│       └── index.js
├── pages
│   ├── _app.js
│   └── index.md
└── next.config.js

```

您可以通过向 `withMarkdoc` 传递 `schemaPath` 选项来选择 schema 的导入位置：

```js
module.exports = withMarkdoc({ schemaPath: './path/to/your/markdoc/schema' })({
  pageExtensions: // [自定义页面扩展](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions)
});
```

### 标签

您通过从 `/markdoc/tags.js`（或 `/markdoc/tags/index.js`）导出对象来注册自定义标签。在此示例中，标签名为 `button`。`render` 字段告诉 Markdoc，每当使用 `{% button %}` 标签时，渲染一个 `Button` React 组件。

```js
// markdoc/tags.js

import { Button } from '../components/Button';

export const button = {
  render: Button,
  attributes: {
    href: {
      type: String
    }
  }
};
```

如果您希望使用 kebab case 命名标签，可以导出如下对象：

```js
// markdoc/tags.js

export default {
  'special-button': {
    render: SpecialButton,
    attributes: {
      href: {
        type: String
      }
    }
  }
};
```

### 节点

自定义节点注册与[标签](#tags)几乎相同，只是您创建 `/markdoc/nodes.js` 文件 instead，例如：

```js
// markdoc/nodes.js

import { Link } from 'next/link';

export const link = {
  render: Link,
  attributes: {
    href: {
      type: String
    }
  }
};
```

此示例覆盖了默认的 `link` [节点](/docs/nodes)。

### 函数

自定义函数注册与标签和节点几乎相同，只是您创建 `/markdoc/functions.js` 文件 instead，例如：

```js
// markdoc/functions.js

export const upper = {
  transform(parameters) {
    const string = parameters[0];

    return typeof string === 'string' ? string.toUpperCase() : string;
  }
};
```

### 高级

如果您希望对配置对象有更多控制权，或正在使用[Markdoc language server for Visual Studio Code](https://github.com/markdoc/language-server)，可以创建 `/markdoc/config.js` 文件并导出完整配置对象。这允许您使用更多数据（如记录或工具函数）扩展配置。

```js
// markdoc/config.js

import tags from './tags';
import nodes from './nodes';
import functions from './functions';

export default {
  tags,
  nodes,
  functions
  // 在此添加其他内容
};
```

## 前置数据

Markdoc 是前置数据无关的，然而 `@markdoc/next.js` 使用 YAML 作为其前置数据语言。您可以在 `_app.js` 中的 `pageProps.markdoc.frontmatter` 下访问前置数据对象，或在内容中使用 `$markdoc.frontmatter` 变量。

例如：

{% example %}

```md
---
title: 使用 Next.js 插件
description: 将 Markdoc 集成到您的 Next.js 应用中
---

# {% $markdoc.frontmatter.title %}
```

{% /example %}

## 部分

部分自动从 `/markdoc/partials/` 目录加载。例如：

{% example %}

```
{% partial file="header.md" /%}
```

{% /example %}

将加载并渲染 `markdoc/partials/header.md` 的内容。

## 布局

要为每个 Markdown/Markdoc 文件创建自定义布局，请在 `_app.js` 中包装您的 `Component`，例如：

```js
// pages/_app.js

import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <Layout frontmatter={pageProps.markdoc.frontmatter}>
      <Component {...pageProps} />
    </Layout>
  );
}
```

## 注释

您可以通过向 Markdoc 分词器传递 `allowComments` 来向 Next.js 内容添加注释：

```js
const withMarkdoc = require('@markdoc/next.js');

withMarkdoc({ tokenizerOptions: { allowComments: true } });
```

然后使用注释语法：

{% example %}

```md
<!-- 您的注释在这里 -->
```

{% /example %}

## 内置 Next.js 标签

Next.js Markdoc 提供了开箱即用的自定义标签，您可以将其添加到 schema 中。要包含它们，请在 schema 目录（例如 `/markdoc/`）中按名称导出它们。例如：

```js
// markdoc/tags/Next.markdoc.js

export { comment, head, link, script } from '@markdoc/next.js/tags';

// 或

export * from '@markdoc/next.js/tags';
```

### Head

渲染一个 [Next.js `Head` 组件](https://nextjs.org/docs/api-reference/next/head)。您可以使用此标签向页面的 `<head>` 添加内容。

{% callout type="warning" %}
您需要为自己创建并注册 `meta`、`title` 等标签。
{% /callout %}

{% example %}

```md
{% head %}

在此处添加自定义 `title` 和 `meta` 标签…

{% /head %}
```

{% /example %}

### Link

渲染一个 [Next.js `Link` 组件](https://nextjs.org/docs/api-reference/next/link)。需要传递 `href` 属性。

{% example %}

```md
{% link href="/docs/getting-started" %}
开始使用
{% /link %}
```

{% /example %}

### Script

渲染一个 [Next.js `Script` 组件](https://nextjs.org/docs/api-reference/next/script)。需要传递 `src` 属性。

{% example %}

```md
{% script src="https://js.stripe.com/v3" /%}
```

{% /example %}
