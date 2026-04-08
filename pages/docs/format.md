---
title: 格式化
description: 使用 Markdoc.format 美化文档或生成源内容
---

# {% $markdoc.frontmatter.title %}

Markdoc 具备将 Markdoc 抽象语法树（AST）转换为源内容的能力。这可用于从数据生成 Markdoc 文件，或美化文档。

## 示例

例如，你想从一些 JSON 数据生成 Markdoc 文件：

```json
// ./数据.json
[
  [34.0522, -118.2437],
  [40.7128, -74.0060],
  [48.8566, 2.3522]
]
```

你可以调用 `Markdoc.format` 并传入一个 AST `Node` 来生成源内容：

{% sideBySide %}

```js
const Markdoc = require('@markdoc/markdoc')
const DATA = require('./data.json')

const list = new Markdoc.Ast.Node(
  'list',
  {ordered: false},
  DATA.map(point => new Markdoc.Ast.Node(
    'item',
    {},
    [
      new Markdoc.Ast.Node('inline', {}, [
        new Markdoc.Ast.Node(
          'text', 
          {content: point.join(', ')}, 
          []
        )
      ])
    ]
  ))
)

Markdoc.format(list)
```

```md
- 34.0522, -118.2437
- 40.7128, -74.006
- 48.8566, 2.3522
```

{% /sideBySide %}


