---
title: 什么是 Markdoc？
description:
---

# {% $markdoc.frontmatter.title %}

Markdoc 是一种基于 Markdown 的文档格式和一个内容发布框架。它最初在 Stripe 内部设计，旨在满足我们面向用户的[产品文档](https://docs.stripe.com)的需求。Markdoc 通过一种用于标签和注释的[自定义语法](/docs/syntax) 扩展了 Markdown，提供了一种为个别用户定制内容和引入交互元素的方法。

{% youtube
  src="https://www.youtube-nocookie.com/embed/MAWK_VmjU1Y?controls=0"
  title="介绍 Markdoc"
  width="50%" /%}

## Markdoc 如何工作

根据设计，Markdoc 不是一个完整的模板语言，不允许混合任意代码和内容。然而，它是一种完全声明式的格式，可以从上到下被机器读取：它解析为一种可遍历的数据结构，以支持强大的静态分析、验证和编程式内容转换。

Markdoc [渲染器](/docs/render) 解释自定义 [标签](/docs/tags) 和 [节点](/docs/nodes) 定义，将文档数据结构转换为可渲染节点的树，最终转换为所需的输出格式。Markdoc 框架目前包括三个渲染器：一个 HTML 字符串渲染器、一个将文档转译为 JavaScript 代码的静态 React 渲染器，以及一个将可渲染树节点直接转换为 React 元素的动态 React 渲染器。

Markdoc 的 React 渲染器使得在 Markdown 内容中使用 React 组件成为可能，支持像标签切换器和可折叠部分这样的交互功能。可以实现自定义渲染器，以引入对额外输出格式和客户端框架的支持。

## 为什么要向 Markdown 添加标记？

我们选择 Markdown 作为起点，因为它易于阅读和推理，已被许多工程师和技术撰稿人所熟悉，并得到大量现有工具生态系统的广泛支持。然而，Markdown 本身并不完全适合编写像文档这样复杂、高度结构化的内容。

Markdoc 提供了一个可扩展的系统，用于定义可在 Markdown 内容中无缝使用的自定义标签。使用自定义标签语法，我们能够表达更精细的文档层次结构、插入交互组件，并支持条件内容、内容包含和变量插值等功能。Markdoc 对 Markdown 语法的扩展被设计为可组合且最小侵入的，在提供关键功能的同时不影响正文的可读性。

## 内部原理

Markdoc 的解析器构建在一个流行的开源 Markdown 库 [`markdown-it`](https://github.com/markdown-it/markdown-it) 之上。Markdoc 使用 `markdown-it` 作为分词器，从 `markdown-it` 发出的令牌数组构建抽象语法树（AST）。Markdoc 的自定义标签语法在 `markdown-it` 插件内部实现。解析标签语法的逻辑是从一个 [peg.js](https://pegjs.org/) 语法生成的。

Markdoc 拥有自己专用的渲染架构，而不是依赖 markdown-it 来生成输出。开发独立的渲染系统是必要的，以便处理 Markdoc 的自定义标签并支持多种输出格式。

## 后续步骤

- [安装 Markdoc](/docs/getting-started)
- [在线试用](/sandbox)
