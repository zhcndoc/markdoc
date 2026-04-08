---
title: Markdoc 语法
---

# {% $markdoc.frontmatter.title %}

Markdoc 语法是 Markdown 的超集，具体遵循 [CommonMark 规范](https://commonmark.org/)。Markdoc 为语法添加了一些扩展，例如标签和注释，我们将在下文描述。这些扩展实现了 Markdoc 强大的可扩展性模型。

有关 Markdoc 标签语法的形式化语法，请参阅 [Markdoc 语法规范](/spec)。

## 节点

节点是 Markdoc 从 Markdown 继承的元素，你可以使用[注释](#annotations)来自定义它们。

{% sideBySide %}

{% example %}

````
# 标题

**粗体**

_斜体_

[链接](/docs/nodes)

![图片](/logo.svg)

列表
- 项目 1
- 项目 1
- 项目 1

> 引用

`行内代码`

```
代码块
```
````

{% /example %}

#### 标题

**粗体**

_斜体_

[链接](/docs/nodes)

列表

- 项目 1
- 项目 1
- 项目 1

> 引用

`行内代码`

```
代码块
```

{% /sideBySide %}

\
更多信息，请参阅[节点文档](/docs/nodes)。

## 标签

标签是 Markdoc 在 Markdown 基础上添加的主要语法扩展。每个标签由 `{%` 和 `%}` 括起来，包含标签名、[属性](#attributes)和内容主体。

与 HTML 类似，你可以嵌套 Markdoc 标签，并使用[属性](#attributes)自定义它们。

{% example %}

```
{% tag %}
内容
{% /tag %}
```

{% /example %}

\
更多信息，请参阅[标签文档](/docs/tags)。

## 属性

向节点和标签传递属性以自定义其行为。你可以传递以下类型的值：`number`、`string`、`boolean`、JSON `array` 或 JSON `object`，可以直接传递或使用[variables](#variables)。

对于标签，你可以使用类似 HTML 的语法：

{% example %}

```
{% city
   index=0
   name="旧金山"
   deleted=false
   coordinates=[1, 4, 9]
   meta={id: "id_123"} 
   color=$color /%}
```

{% /example %}

## 注释

由于类似 HTML 的语法不适用于节点，我们提供了另一种选项，称为_注释_：将属性写在标签或节点之后，用另一组 `{%` 和 `%}` 括起来。

{% example %}

```
{% table %}

- 函数 {% width="25%" %}
- 返回  {% colspan=2 %}
- 示例  {% align="right" %}

{% /table %}
```

{% /example %}

\
更多信息，请参阅[属性文档](/docs/attributes)。
## 变量

Markdoc 变量允许你在运行时自定义 Markdoc 文档。所有变量都有 `$` 前缀。

{% example %}

```
这里我正在渲染一个自定义的 {% $variable %}
```

{% /example %}

变量必须包含可 JSON 序列化的内容，例如字符串、布尔值、数字、数组和 JSON 对象。\
你可以使用点表示法访问嵌套值，类似于 JavaScript：

{% example %}

```
这是一个深度嵌套的变量 {% $markdoc.frontmatter.title %}
```

{% /example %}

你可以在整个文档中使用变量作为内容本身：

{% example %}

```
© {% $currentYear %} Stripe
```

{% /example %}

\
更多信息，请参阅[变量文档](/docs/variables)。

## 函数

函数的外观和行为类似于 JavaScript 函数。你可以从文档正文、注释内部或标签属性中调用它们。函数参数以逗号分隔。函数调用不支持尾随逗号。

{% example %}

```
# {% titleCase($markdoc.frontmatter.title) %}

{% if equals(1, 2) %}
显示密码
{% /if %}

{% tag title=uppercase($key) /%}
```

{% /example %}

\
更多信息，请参阅[函数文档](/docs/functions)。

## 注释

{% callout type="warning" %}
注意：当前注释支持需要向 `Markdoc.Tokenizer` 传递 `allowComments: true`。  
在未来的 Markdoc 版本中，这将默认启用。
{% /callout%}

Markdoc 支持 [Markdown 注释语法](https://spec.commonmark.org/0.30/#example-624)，你可以向文档添加注释，而不会使内容显示在可渲染输出中。

{% example %}

```
<!-- 注释写在这里 -->
```

{% /example %}

## 后续步骤

- [渲染 Markdoc](/docs/render)
- [验证你的内容](/docs/validation)