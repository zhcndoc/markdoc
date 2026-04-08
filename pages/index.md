---
title: 一个强大、灵活、基于 Markdown 的创作框架
description: 从个人博客到大型文档站点，Markdoc 是一个能与您共同成长的内容创作系统。
---

{% section .hero %}

{% typewriter /%}

> 从个人博客到大型文档站点，Markdoc 是一个能与您共同成长的内容创作系统。

[查看文档](/docs/getting-started) {% .primary %}

{% /section %}

{% section .try .no-mobile %}

{% sandbox height="630px" options={"scrollbarStyle": null} /%}

{% /section %}

{% section .value-props %}

{% table %}

---

- {% ascii "key" /%}

  {% item %}

  ### 开源 {% .jumbo %}

  完全掌控您的代码和内容。Markdoc 是开源的且完全可扩展。
  {% /item %}

- {% ascii "pencil" /%}

  {% item %}

  ### 开发者与作者友好 {% .jumbo %}

  Markdoc 提供强大、灵活的开发者体验（DX），同时具备同样出色的创作体验（AX）。

  {% /item %}

- {% ascii "card" /%}

  {% item %}

  ### 随处采用 {% .jumbo %}

  使用 Markdoc 创建交互式文档体验、静态内容站点、创作工具等。

  {% /item %}

{% /table %}

{% /section %}

{% section .get-started %}

{% sideBySide %}

{% item %}

## 快速上手 {% .jumbo %}

[Markdoc core](https://github.com/markdoc/markdoc) 是一个轻量级包，包含您入门所需的一切。如果想更快上手，请查看我们的 [Next.js 插件](https://github.com/markdoc/next.js)，并零样板部署 Markdoc 文档站点。

[探索文档](/docs/getting-started) {% .primary %}

[实时编辑]() {% .primary %} {% .live-edit %}

{% /item %}

```shell
npm install @markdoc/markdoc
```

```js
import Markdoc from '@markdoc/markdoc';

const doc = `
# Hello world.
> My first Markdoc page
`;

const ast = Markdoc.parse(doc);

const content = Markdoc.transform(ast);

const html = Markdoc.renderers.html(content);
```

{% /sideBySide %}

{% /section %}

{% section .by-stripe %}

{% sideBySide %}

### Markdoc 驱动 Stripe 文档 {% .jumbo %}

Stripe 创建 Markdoc 来驱动其最大且[最详细的内容站点](https://stripe.com/docs)。此后，我们在整个公司采用它，编写了数十万行 Markdoc 代码，创建了数千页表达力强、自定义的文档。

{% /sideBySide %}

---

{% features %}

- **熟悉的语法**

  Markdoc 是 [Markdown](https://commonmark.org/) 的语法扩展，因此您可以继续使用所有熟悉的语法和工具。

  [学习语法](/docs/syntax) {% .primary %}

- **易于扩展**

  Markdoc 允许您自定义系统的所有方面，从[自定义标签](/docs/tags)和[节点](/docs/nodes)到全新的[渲染器](/docs/render)。

  [了解更多](/docs/render) {% .primary %}

- **内置验证**

  您可以在内容系统中添加自定义验证，确保不会出现故障且内容保持一致。

  [了解更多](/docs/validation) {% .primary %}

{% /features %}

{% /section %}
