---
title: 变量
description: 变量让您能够在运行时转换和自定义您的文档。
---

# {% $markdoc.frontmatter.title %}

变量让您能够在运行时自定义 Markdoc 文档。

{% example %}

```
这里我正在渲染一个自定义的 {% $variable %}
```

{% /example %}

当服务端数据发生变化时，您可以通过重新渲染页面来实时呈现它。每次重新渲染都会使用该变量的最新值。

（某些模板语言允许变量在渲染过程中发生变化，从而让您能够在 for 循环等结构中使用它们。Markdoc 不这样做，但它提供了[替代方法](#alternatives)来完成同样的工作。）

## 全局变量

您可以通过几种方式传递变量。最简单的方式是通过您的[配置](/docs/config)对象上的 `variables` 字段。

{% example %}

```js
const doc = `
{% if $flags.my_feature_flag %}
用户名: {% $user.name %}
{% /if %}
`;

/** @type {import('@markdoc/markdoc').Config} */
const config = {
  variables: {
    flags: {
      my_feature_flag: true
    },
    user: {
      name: 'Dr. Mark'
    }
  }
};

const ast = Markdoc.parse(doc);
const content = Markdoc.transform(ast, config);
```

{% /example %}

## 局部文件中的变量

您也可以向[局部文件](/docs/tags#partial)传递变量。要执行此操作，请设置 `variables` 属性：

{% example %}

```
{% partial variables={sdk: "Ruby", version: 3} file="header.md" /%}
```

{% /example %}

在局部文件中，访问值的方式与常规变量相同：

{% example %}

```
SDK: {% $sdk %}
版本: {% $version %}
```

{% /example %}

## 替代方案

变量在页面渲染期间是不可变的。这保持了渲染行为的一致性和速度。但这意味着某些任务应该使用替代方案：

* 若要执行无副作用的计算，请使用[自定义或内置 Markdoc 函数](/docs/functions)。
* 若要在渲染期间更新值，请使用自定义 Markdoc 转换函数。例如，[运行 for 循环](/docs/examples#loops)或[累积表格目录的条目](/docs/examples#table-of-contents)。

## 注意事项

Markdoc 不支持向某些[node](/docs/nodes)（例如 `link` 节点的 `href`）传递变量。相反，请将变量传递给自定义 `link` [Tag](/docs/tags) 的 `href` [attribute](/docs/attributes)。

{% sideBySide %}

{% item %}

#### 错误

{% example %}

```
[链接]({% $variable %})
```

{% /example %}

{% /item %}

{% item %}

#### 正确

{% example %}

```
{% link href=$variable %}链接{% /link %}
```

{% /example %}

{% /item %}

{% /sideBySide %}

## 后续步骤

- [验证您的内容](/docs/validation)
- [渲染为 HTML 或 React](/docs/render)
