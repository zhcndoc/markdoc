---
title: 常见问题
---

# {% $markdoc.frontmatter.title %}

## Markdoc 是否符合 CommonMark 规范？

Markdoc 的语法在很大程度上是 [CommonMark 规范](https://commonmark.org/) 的超集。Markdoc 引入了其自身的[语法扩展](/docs/syntax)，包括[标签](/docs/tags)、[注解](/docs/syntax#annotations)和[变量插值](/docs/variables)。Markdoc 还支持 [GitHub 风格的表格](https://github.github.com/gfm/#tables-extension-)，但我们建议您使用 Markdoc 自带的[列表式表格](/docs/tags#table)。

### Setext 标题

Markdoc 不支持的唯一 CommonMark 指定功能是 [Setext 标题](https://spec.commonmark.org/0.30/#setext-headings)。这一设计决策主要是 Markdoc 核心团队的内部偏好：在我们看来，Setext 标题与更常用的 [ATX 标题](https://spec.commonmark.org/0.30/#atx-heading) 功能重复，且引入了更多歧义。如果您想在 Markdoc 中使用 Setext 标题，或需要支持该功能以确保与现有内容的兼容性，您仍然可以重新配置 Markdoc 的词法分析器以重新启用 [markdown-it](https://github.com/markdown-it/markdown-it) 的 `lheading` 规则。

### 缩进

在符合 CommonMark 的 Markdown 中，任何缩进四个空格的内容都会被当作[代码块](https://spec.commonmark.org/0.30/#indented-code-blocks)处理。不幸的是，这种行为使得使用任意缩进来提高复杂结构文档的可读性变得困难。

在 Markdoc 中使用嵌套标签时，对标签内的内容进行缩进以明确深度级别会很有帮助。为了支持任意缩进，我们必须禁用基于缩进的代码块，并修改其他几个处理基于缩进的代码块的 markdown-it 解析规则。Markdoc 的词法分析器接受一个 `allowIndentation` 选项来应用这些更改：

{% example %}
```js
const example = `
{% foo %}
  {% bar %}
    This is content inside of nested tags
  {% /bar %}
{% /foo %}
`;

const tokenizer = new markdoc.Tokenizer({allowIndentation: true}));
const tokens = tokenizer.tokenize(example);
const ast = markdoc.parse(tokens);
```
{% /example %}

`allowIndentation` 选项是实验性的，默认未启用。启用该选项后，将无法使用基于缩进的代码块。无论您是否打算利用 `allowIndentation` 选项，我们都强烈建议使用[围栏式代码块](https://spec.commonmark.org/0.30/#fenced-code-blocks)代替基于缩进的代码块。

{% callout type="warning" %}
通过 `allowIndentation` 选项纳入任意级别缩进的 Markdoc 内容可能与其他符合 CommonMark 的 Markdown 处理工具不兼容。
{% /callout %}

### Markdoc 标准化

我们已经起草了一份描述 Markdoc 标签语法的规范。我们欢迎第三方实现者采纳并为 Markdoc 标签规范做出贡献。目前，标签语法是 Markdoc 中我们正式规范化的唯一部分，但我们正在认真考虑起草 Markdoc 抽象语法树（AST）的 JSON 表示规范的可能性，以促进 Markdoc 工具之间的互操作性。

未来，我们可能会创建一个与 CommonMark 规范差异更大的 Markdown 独立方言，移除 angle-bracket [块引用](https://spec.commonmark.org/0.30/#block-quotes) 等可由 Markdoc 标签替代的额外功能。我们认为有机会创建一种专为 Markdoc 设计的 Markdown 变体，它更少歧义、更具规范性，更利于严格规范。这将与我们今天支持的 CommonMark 对齐语法并行提供，让用户可以选择是追求更简洁的语法还是与现有 Markdown 工具和内容的兼容性。

## 为何创建 Markdoc 而不是使用替代方案？

### 为何不是 MDX？

[MDX](https://mdxjs.com/) 是一种 Markdown 变体，允许用户嵌入用 JavaScript 和 React 的 JSX 模板语法编写的内容。与 Markdoc 一样，MDX 使得将 React 组件融入文档成为可能。关键区别在于，MDX 支持任意复杂的 JavaScript 逻辑（想想：文档即代码），而 Markdoc 强制代码与内容之间保持严格分离（想想：文档即数据）。

Markdoc 使用完全声明式的方法进行组合和流程控制，而 MDX 依赖于 JavaScript 和 React。这意味着 MDX 为用户提供更多的权力和灵活性，但代价是复杂性——内容可能迅速变得与常规代码一样复杂，从而导致可维护性 complications 或更困难的创作环境。

在 Stripe 创建 Markdoc 的关键动机之一是创建一个针对编写而非编程优化的格式，以便我们克服遗留文档平台中混合代码和内容所带来的挑战。使用 Markdoc，贡献者可以快速迭代，而无需将其编辑提交给代码审查，以及我们必须应用于支持嵌入式 JavaScript 的格式的技术审查标准。Markdoc 还帮助我们加强对呈现和页面逻辑的控制，避免一次性 hack 和过程化内容生成引入错误和不可预测行为的情况。

Markdoc 一流的声明式标签语法与 Markdown 内容无缝集成，可以更简单地在统一、轻量级的方式下处理内容转换、静态分析和验证。在 MDX 中，其中一些任务需要操作更复杂的 JavaScript AST 并考虑 JavaScript 语言特性的全谱。MDX 还有显著更大的运行时依赖占用，并依赖 JavaScript 解析器来处理嵌入式逻辑。

### 为何不是 AsciiDoc？

[AsciiDoc](https://asciidoc.org/) 是一种专为技术写作设计的纯文本标记格式，融合了 DocBook 和其他发布技术的理念。AsciiDoc 在很多方面做得很对——可扩展性、对高度结构化内容的支持、解析为 AST、开放治理。

我们是 AsciiDoc 的忠实粉丝——它在我们开始设计 Markdoc 时是一个主要灵感来源。事实上，我们在 2017 年早期为 Stripe 现代化内容格式所做的努力涉及一个基于 Ruby 的 [AsciiDoctor](https://asciidoctor.org/) 库的概念验证。有几个原因最终让我们转向 Markdown，而不是继续以 AsciiDoc 推进我们的工作。

AsciiDoc 不如 Markdown  ubiquitous，这意味着它对工程师和技术作家来说不那么熟悉。AsciiDoc 有许多语法上的怪癖，为采用者制造摩擦，使其难以向已经了解并想要 Markdown 的用户推销。例如，AsciiDoc 要求使用[多个前导星号](https://docs.asciidoctor.org/asciidoc/latest/lists/unordered/#nested-unordered-list)来表达嵌套项目符号列表，因为该格式设计为不将空格视为重要。并且为了嵌套定界内容块，它依赖于[变化定界符行的长度](https://docs.asciidoctor.org/asciidoc/latest/blocks/delimited/#nesting)——不直观且容易出错的语法。

AsciiDoc 的可扩展性模型本允许我们重新利用该格式的一些内置模式来做许多与 Markdoc 中相同的事情，但以可用性为代价，因为 AsciiDoc 最终并非为我们的需求和使用场景设计。Markdown 加上 Markdoc 的语法扩展产生的整体表面积小于 AsciiDoc 的功能集，这意味着更少的复杂性和更轻松的采用。
