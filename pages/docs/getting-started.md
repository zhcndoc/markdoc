---
title: 开始使用 Markdoc
description: 如何开始使用 Markdoc
---

# {% $markdoc.frontmatter.title %}

请按照以下说明在您的应用中安装 Markdoc。或者查看我们的[集成指南](/docs/nextjs)以帮助您构建文档站点。

## 安装 Markdoc

安装 Markdoc 库：

```shell
npm install @markdoc/markdoc
```

或

```shell
yarn add @markdoc/markdoc
```

## 导入 Markdoc

在您的应用中导入 Markdoc 库：

```js
const Markdoc = require('@markdoc/markdoc');
```

如果使用 ESM：

```js
import Markdoc from '@markdoc/markdoc';
```

## 使用 Markdoc

调用 `parse`、`transform` 和 `render` Markdoc 函数来渲染您的内容。

```js
const source = '# Markdoc';

const ast = Markdoc.parse(source);
{% comment %}
// 忽略prettier
{% /comment %}
const content = Markdoc.transform(ast, /* [配置](/docs/config) */);

const html = Markdoc.renderers.html(content);
```

## 后续步骤

- [学习 Markdoc 语法](/docs/syntax)
