# Markdoc 标签语法规范

<table>
<tbody>
<tr>
  <th><strong>版本：<strong></th>
  <td>0.1.0 草案</td>
</tr>
<tr>
  <th><strong>作者：</strong></th>
  <td>Ryan Paul</td>
</tr>
</tbody>
</table>

Markdoc 是一种基于 Markdown 的文档格式和内容发布框架。Markdoc 通过自定义的标签和注解语法扩展了 Markdown，提供了一种为个别用户定制内容和引入交互元素的方法。本规范描述了 Markdoc 标签的语法以及如何在 Markdown 内容中解析它们。

注意：本规范为早期草案，目前大部分内容仍在进行中。

# 标签

TagStart :: `{%`

TagEnd :: `%}`

TagInterior :: 以下之一
- TagOpen
- TagSelfClosing
- TagClose

Tag :: TagStart Space* TagInterior TagEnd

Markdoc {Tag} 是一段标记，用于在 Markdoc 文档中应用自定义行为或格式。标签可以嵌套，从而表达层次结构或对封闭的子内容应用自定义格式。配对的开始标签和结束标签表示包含子内容的标签元素的开始和结束。

```example
{% example %}
此段落嵌套在 Markdoc 标签内。
{% /example %}
```

标签也可以是自闭合的，不包含嵌套内容：

```example
{% example /%}
```

:: *标签分隔符*（{TagStart} 和 {TagEnd}）指示 Markdown 内容中存在 Markdoc 标签。分隔符内的字符被视为 {TagInterior}。当在 Markdown 文档中检测到 {TagStart} 分隔符时，解析器应向前扫描，直到找到第一个未包含在 {ValueString} 内的 {TagEnd} 分隔符，以确定标签结束的位置。

由特定 Markdoc 标签及其属性应用何种行为和格式，由各个 Markdoc 实现自行决定。

## 开始标签

PrimaryAttribute :: Space+ Value

AttributeItem :: Space+ Attribute

TagOpen :: Identifier PrimaryAttribute? AttributeItem* Space* 

:: *开始标签*表示包含嵌套子内容的 Markdoc 标签元素的开始。开始标签的 {TagInterior} 必须包含标签名称，并可包含零个或多个标签属性。

标签在 {Identifier} 后可选择性地带有一个未命名的 {PrimaryAttribute} 值：

```example
{% if $foo %}
这是 `if` 标签内的一个段落。
{% /if %}
```

## 自闭合标签

TagSelfClosing :: TagOpen `/` 

:: *自闭合标签*（在 {TagInterior} 末尾由正斜杠指示）表示不包含嵌套子内容的 Markdoc 标签元素。自闭合标签的 {TagInterior} 必须包含标签名称，并可包含零个或多个标签属性。

## 结束标签

TagClose :: `/` Identifier Space* 

:: *结束标签*（在 {TagInterior} 开头由正斜杠指示）表示包含嵌套子内容的 Markdoc 标签元素的结束。结束标签的 {TagInterior} 可能包含标签名称和可选的尾随空白。结束标签与具有相同标签名称的最近一个*开始标签*相对应。

注意：未来的草案将指定不匹配的开始和结束标签的畸形文档的预期解析行为。

## 标签形式

Markdoc 标签在 Markdown 文档中可以作为 [块级或内联](https://spec.commonmark.org/0.30/#blocks-and-inlines) 元素使用。

### 块级形式

当标签的开始和结束标记各自单独出现在一行上，且除空白外没有其他字符时，应将其解析为块级元素。在以下示例中，标签 `foo` 应被解析为包含单个段落的块级元素：

```example
{% foo %}
这是块级标签内的内容
{% /foo %}
```

### 内联形式

当*开始标签*和*结束标签*出现在同一段落内的同一行上时，该标签应被视为嵌套在块级段落元素内的内联文档元素：

```example
这是一个段落 {% foo %}包含标签的内容{% /foo %}
```

当*开始标签*和*结束标签*出现在同一行上且周围没有其他内容时，该标签仍应被视为内联文档元素，嵌套在隐式的块级段落元素内：

```example
{% foo %}这是内联标签内的内容{% /foo %}
```

## 注解

Annotation :: TagBegin Space* Attribute* Space* TagEnd

{Annotation} 将 {Attribute} 应用于封闭的 Markdown 块。注解内的属性被视为文档节点本身的属性。例如，注解可用于为标题节点添加 CSS 类：

```example
# 标题 {% .example %}
```

{Annotation} 只能作为内联文档节点使用。当注解单独出现在一行时，它被视为嵌套在块级段落元素内。在 {Annotation} 内，每个 {Attribute} 由空格分隔。

## 属性

Attribute :: 以下之一
- AttributeFull
- AttributeShorthand

AttributeFull :: Identifier `=` Value

属性有两种类型：完整属性（{AttributeFull}）和简写属性（{AttributeShorthand}）。

完整 {Attribute} 是由 {Identifier} 和 {Value} 组成的键值对，两者由 {`=`} 号分隔。{Identifier} 作为属性的键。组成 {Attribute} 的标记之间不允许有空白。

```example
{% foo="bar" baz=[1, 2, 3] %}
```

### 简写属性

AttributeShorthand :: ShorthandSigil Identifier

ShorthandSigil :: 以下之一 `#` `.`

简写属性由 {ShorthandSigil} 后跟一个 {Identifier} 组成。符号表示属性的键。下表描述了每个符号表示的属性键：

符号 | 键
-|-
{`#`} | `id`
{`.`} | `class`

简写属性等价于使用符号表示的键的完整属性。以下示例产生相同的输出：

```example
{% #foo .bar %}
```

```example
{% id="foo" class="bar" %}
```

当有多个使用类符号（{.}）的简写属性时，解析器会将它们合并为一个 `class` 属性。以下示例是等价的：

```example
{% .foo .bar .baz %}
```

```example
{% class="foo bar baz" %}
```

# 插值

Interpolation :: `{%` Space* InterpolationValue Space* `%}`

InterpolationValue :: 以下之一
- Function
- Variable

{Interpolation} 用于将 Markdoc 变量或 Markdoc 函数的返回值插入 Markdown 文档的文本中。插值只能在内联文档节点内使用。当插值单独出现在一行时，它被隐式嵌套为段落内的内联内容。

```example
你好 {% $username %}
```

# 值

Value :: 以下之一
- PrimitiveValue
- CompoundValue
- Variable
- Function


## 原始值

PrimitiveValue :: 以下之一
- ValueNull
- ValueBoolean
- ValueNumber
- ValueString

### Null

ValueNull :: `null`

空值用关键字 {null} 表示。

### Boolean

ValueBoolean :: 以下之一
- `true`
- `false`

### Number

ValueNumber :: `-`? Digit+ Fraction?

Digit :: /[0-9]/

Fraction :: `.` Digit+

### String

ValueString :: `"` StringElement* `"`

StringElement :: 以下之一
- StringCharacter
- StringEscapeSequence

StringEscapeSequence :: `\` StringEscapeCharacter

StringEscapeCharacter :: 以下之一 `"` `\` `n` `r` `t`

StringCharacter :: "任意字符" 但不包括 `"` 或 `\`

## 复合值

CompoundValue :: 以下之一
- ValueArray
- ValueHash

### 数组

ValueArray ::
  `[` Space* ArrayItem* ArrayItemWithOptionalComma? Space* `]`

ArrayItem :: Value Space* `,` Space*

ArrayItemWithOptionalComma :: Value Space* `,`?

数组值（{ValueArray}）由一对匹配的方括号组成，其中包含逗号分隔的 {Value} 序列。包含空内容或仅空白的匹配方括号被解析为空数组值。在非空数组中允许可选的尾随逗号。数组可以无限深度嵌套，并且可以包含 Markdoc {Variable} 或 {Function} 调用。

```example
{% foo=[1, false, ["bar", $baz]] %}
```

### 哈希

ValueHash ::
  `{` Space* HashItem* HashItemWithOptionalComma? Space* `}`

HashItem :: HashKeyValue `,` Space*

HashKeyValue :: HashKey `:` Space* Value Space*

HashItemWithOptionalComma :: HashKeyValue `,`?

HashKey :: 以下之一
- Identifier
- String

哈希值（{ValueHash}）由一对匹配的花括号组成，其中包含逗号分隔的键值对（{HashKeyValue}）序列。包含空内容或仅空白的匹配花括号被解析为空哈希值。在非空哈希中允许可选的尾随逗号。哈希可以无限深度嵌套，并且其值可以包含 Markdoc {Variable} 或 {Function} 调用。{HashKey} 可以由裸标识符或用双引号括起来的字符串组成。

```example
{% foo={key: "example value", "quoted key": $variable} %}
```

## 变量

Variable :: VariableSigil Identifier VariableTail*

VariableTail :: 以下之一
- `.` Identifier
- `[` VariableSegmentValue `]`

VariableSegmentValue :: 以下之一
- ValueNumber
- ValueString
- Variable

VariableSigil :: 以下之一 `$` `@`

{Variable} 允许 Markdoc 内容合并外部值。变量可用于 {Interpolation} 或替换标签属性中的值。变量由多个段组成，旨在支持访问复杂数据结构中深层嵌套的值。{Variable} 段可以是标识符或用方括号括起来的值。如何将 {Variable} 解析为值由各个 Markdoc 实现自行决定。

```example
{% foo=$bar.baz[10].qux %}
```

注意：未来的草案将指定带有 `$` 和 `@` 符号的变量的预期行为。目前，`$` 符号应被视为常规变量，而 `@` 符号保留供将来使用。

## 函数

Function :: Identifier `(` Space* FunctionParameters* Space* `)`

FunctionParameters :: Value FunctionParameterTail*

FunctionParameterTail :: Space* `,` Space* FunctionParameter

FunctionParameter :: one of
  - FunctionParameterNamed
  - Value

FunctionParameterNamed :: Identifier `=` Value

函数由一个{标识符}后跟用括号括起来的{函数参数}组成。函数用于在 Markdoc 文档中引入外部逻辑。

{函数参数}可以是{值}或由等号分隔的键值对。函数可用于{插值}或替换标签属性中的值。函数参数可以是任意有效的{值}，包括{变量}或另一个{函数}。如何评估{函数}由各个 Markdoc 实现决定。

注意：未来的草案将指定应包含在 Markdoc 实现中的一组默认内置函数。

# 空格

Space :: one of
- "空格 (U+0020)"
- "水平制表符 (U+0009)"
- "换行符 (U+000A)"

# 标识符

Identifier :: /[a-zA-Z]/ IdentifierTail*

IdentifierTail :: /[-_a-zA-Z0-9]/*
