---
title: 函数
description: 函数让你扩展 Markdoc 以运行自定义代码。
---

# {% $markdoc.frontmatter.title %}

函数让你通过自定义工具扩展 Markdoc，这些工具可以在运行时转换你的内容和[变量](/docs/syntax#variables)。

## 内置函数

Markdoc 开箱即用，包含六个内置函数：`equals`、`and`、`or`、`not`、`default` 和 `debug`。

{% table %}

- 函数
- 返回值
- 示例
- 描述

---

- `equals`
- `boolean`
- `equals($myString, 'test')`
- 执行常见的布尔操作

---

- `and`
- `boolean`
- `and($boolean1, $boolean2)`
- 执行常见的布尔操作

---

- `or`
- `boolean`
- `or($boolean1, $boolean2)`
- 执行常见的布尔操作

---

- `not`
- `boolean`
- `not(or($boolean1, $boolean2))`
- 执行常见的布尔操作

---

- `default`
- `mixed`
- `default($variable, true)`
- 如果第一个参数是 `undefined`，则返回第二个参数

---

- `debug`
- `string`
- `debug($anyVariable)`
- 将值序列化为 JSON 格式以供调试

{% /table %}

### 与/或/非

将这些函数与 `if` [标签](/docs/tags) 结合使用，以执行布尔操作并在条件满足时渲染内容。

{% callout type="warning" %}
与 JavaScript 不同，Markdoc 只将 `undefined`、`null` 和 `false` 视为假值。
{% /callout %}

{% example %}

```
这段内容始终显示
{% if and(not($a), or($b, $c)) %}
仅当 $a 为假值且 $b 或 $c 为真时显示此内容。
{% /if %}
```

{% /example %}

### 等于

使用 `equals` 函数将变量与给定值进行比较。此函数使用 JavaScript 的严格相等语义，仅用于原始类型。

{% example %}

```
{% if equals($myVar, "test") %}
变量 $myVar 等于字符串 "test"。
{% /if %}
```

{% /example %}

### 默认值

此函数用于为可能不存在的变量设置值。

{% example %}

```
{% if default($showPrompt, true) %}
嘿，你好！
{% /if %}
```

{% /example %}

### 调试

此函数将值作为序列化的 JSON 值渲染到文档中。这有助于确定[变量](/docs/syntax#variables)中的值。

{% example %}

```
{% debug($myVar) %}
```

{% /example %}


## 创建自定义函数

要使用你自己的函数扩展 Markdoc，首先创建自定义函数定义：

```js
const includes = {
  transform(parameters) {
    const [array, value] = Object.values(parameters);

    return Array.isArray(array) ? array.includes(value) : false;
  }
};

const uppercase = {
  transform(parameters) {
    const string = parameters[0];

    return typeof string === 'string' ? string.toUpperCase() : string;
  }
};
```

然后，将函数传递给您的[`config`对象](/docs/config)。

```js
/** @type {import('@markdoc/markdoc').Config} */
const config = {
  functions: {
    includes,
    uppercase
  }
};

const content = Markdoc.transform(ast, config);
```

最后，在您的 Markdoc 内容中调用这些函数

{% example %}

```md
{% if includes($countries, "AR") %} 🇦🇷 {% /if %}
{% if includes($countries, "AU") %} 🇦🇺 {% /if %}
{% if includes($countries, "ES") %} 🇪🇸 {% /if %}
{% if includes($countries, "JP") %} 🇯🇵 {% /if %}
{% if includes($countries, "NG") %} 🇳🇬 {% /if %}
{% if includes($countries, "US") %} 🇺🇸 {% /if %}
```

{% /example %}

## 后续步骤

- [验证您的内容](/docs/validation)
- [渲染为 HTML 或 React](/docs/render)
