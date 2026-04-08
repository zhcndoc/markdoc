---
title: 属性
description: 属性用于向 Markdoc 标签传递数据。
---

# {% $markdoc.frontmatter.title %}

属性允许你向 Markdoc 标签传递数据，类似于[HTML 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)或[React 属性](https://reactjs.org/docs/components-and-props.html)。

你可以传递以下类型的值：`number`、`string`、`boolean`、JSON `array` 或 JSON `object`，可以直接传递或使用[变量](/docs/variables)。对于标签，可以使用类似 HTML 的语法。

{% example %}

```
{% city
   index=0
   name="San Francisco"
   deleted=false
   coordinates=[1, 4, 9]
   meta={id: "id_123"}
   color=$color /%}
```

{% /example %}

要向节点传递属性，不能使用类 HTML 语法。相反，使用_注解_语法。将属性放在节点之后，用它们自己的{% 和 %}包围。

{% example %}

```
{% table %}

- Function {% width="25%" %}
- Returns  {% colspan=2 %}
- Example  {% align=$side %}

{% /table %}
```

{% /example %}

（注解语法也适用于标签。但节点必须使用此语法。）

属性中的字符串必须用双引号括起来。如果要在字符串中包含字面量的双引号，可以使用 \\" 进行转义。

{% example %}

``` {% process=false %}
{% data delimiter="\"" /%}
```

{% /example %}

## 属性简写

在任何一种语法中，都可以使用 `.my-class-name` 和 `#my-id` 作为 `class=my-class-name` 和 `id=my-id` 的简写。

{% example %}

``` {% process=false %}
# Examples {% #examples %}

{% table .striped #exampletable %}
- One 
- Two
- Three
{% /table %}
```

{% /example %}

## 定义属性

Markdoc 允许你为每个[标签](/docs/tags)配置自定义属性类型。为属性指定类型会限制该属性可以传递给标签的值，从而在[验证](/docs/validation)时限制可能产生错误的值。

以下示例为 `Callout` 标签定义了一个属性。默认情况下，该属性设置为 `note`，并根据 `matches` 数组进行验证。

```js
{
  render: 'Callout',
  children: ['paragraph', 'tag', 'list'],
  attributes: {
    type: {
      type: String,
      default: 'note',
      required: true,
      matches: ['caution', 'check', 'note', 'warning'],
      errorLevel: 'critical',
    },
  }
};
```

{% table %}

- 选项
- 类型
- 描述

---

- `type`
- - `String` 或 `"String"`
  - `Boolean` 或 `"Boolean"`
  - `Number` 或 `"Number"`
  - `Object` 或 `"Object"`
  - `Array` 或 `"Array"`
  - 一个你创建的[自定义属性](#create-a-custom-attribute)
- 指定属性的数据类型。

---

- `default`
- 该值必须与属性定义的数据类型相同，如果适用，必须出现在 `matches` 中。
- 指定未提供值时属性的默认行为。

---

- `required`
- `boolean`
- 指定是否必须向属性传递值。如果未提供值，系统将抛出错误。

---

- `matches`
- 一个正则表达式、字符串数组或接受选项并返回字符串的函数。
- 指定要与属性值匹配的字符串模式。

---

- `errorLevel`
- - `debug`
  - `info`
  - `warning`
  - `error`
  - `critical`
- 指定 Markdoc 报告验证错误的方式。错误按严重性升序排列。

{% /table %}

## 创建自定义属性

使用 Markdoc，你可以创建自定义属性，并在标签中使用它们。在此示例中，你正在创建一个 `DateTime` 属性，以确保提供有效的字符串。

```js
// ./attribute-types/DateTime.js

export class DateTime {
  validate(value, config) {
    if (typeof value !== 'string' || isNaN(Date.parse(value)))
      return [
        {
          id: 'invalid-datetime-type',
          level: 'critical',
          message: 'Must be a string with a valid date format'
        }
      ];

    return [];
  }

  transform(value, config) {
    return Date.parse(value);
  }
}
```

然后，将自定义属性传递给[`config` 对象](/docs/config)中的标签定义。

```js
import { DateTime } from './attribute-types/DateTime';

/** @type {import('@markdoc/markdoc').Config} */
const config = {
  tags: {
    'tag-name': {
      render: 'YourComponent',
      attributes: {
        created: {
          type: DateTime,
          required: true
        }
      }
    }
  }
};
```

## 后续步骤

- [向属性传递变量](/docs/variables)