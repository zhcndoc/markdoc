---
title: 验证
description: 扩展 Markdoc 以为您的文档提供自定义验证。
---

# {% $markdoc.frontmatter.title %}

## 语法验证

Markdoc 开箱即用地支持使用 `validate` 函数进行语法验证。

```ts
validate(AstNode, ?Config) => ValidateError[]
```

\
调用 `validate` 是一个可选步骤，您可以在渲染之前使用它来验证抽象语法树（AST）。这在测试、持续集成或编辑器扩展等开发工具中非常有用。

{% example %}

```js
const doc = `# Heading`;

const ast = Markdoc.parse(doc);

const errors = Markdoc.validate(ast, config);

// 对错误进行处理
```

{% /example %}

如果文档包含语法错误，`validate` 的输出如下所示：

{% sideBySide %}

```js
const doc = `{% $invalid_code %}`;

const ast = Markdoc.parse(doc);

const errors = Markdoc.validate(ast, config);
```

```js
// errors
[
  {
    type: 'tag',
    lines: [1, 2],
    location: {
      start: { line: 1 },
      end: { line: 2 }
    },
    error: {
      id: 'missing-closing',
      level: 'critical',
      message: "节点 'callout' 缺少闭合标签"
    }
  }
];
```

{% /sideBySide %}

## 模式验证

您还可以通过向 [Node](/docs/nodes) 或 [Tag](/docs/tags) 定义，或向您的 [自定义属性类型](/docs/attributes#create-a-custom-attribute) 添加 `validate` 函数，来扩展 Markdoc 并添加自定义验证规则。

### 验证内容

使用 `Node` 或 `Tag` 的 `validate` 函数来验证内容是否正确，特别是 `children`（子节点）。

{% example %}

```js
/** @type {import('@markdoc/markdoc').Config} */
const config = {
  tags: {
    provider: {
      render: 'Provider',
      // ...
      validate(node) {
        if (node.children.length !== 1) {
          return [
            {
              id: 'provider-children',
              level: 'critical',
              message: 'Provider 必须只有一个子节点。'
            }
          ];
        }
        return [];
      }
    }
  }
};
```

{% /example %}

### 验证属性

使用 [自定义 `Attribute` 类型](/docs/attributes#create-a-custom-attribute) 来验证传递给您的标签和节点的属性是否正确。

{% example %}

```js
export class ImageSrc {
  validate(value, config) {
    if (!value.startsWith('https://')) {
      return [
        {
          id: 'image-src',
          level: 'error',
          message: '所有图片 src 应包含完整 URL。'
        }
      ];
    }
    return [];
  }
}

/** @type {import('@markdoc/markdoc').Config} */
const config = {
  image: {
    render: 'img',
    attributes: {
      src: {
        type: ImageSrc,
        required: true
        // ...
      }
      // ...
    }
  }
};
```

{% /example %}

## 后续步骤

- [将内容渲染为 HTML 或 React](/docs/render)
- [查看常见示例](/docs/examples)
