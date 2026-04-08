---
title: 常见示例
description:
---

# {% $markdoc.frontmatter.title %}

使用 Markdoc，可以轻松添加通常与文档站点关联的功能。以下示例涵盖循环、语法高亮、标签页等内容。

如果您正在寻找其他示例代码，请查看我们的[示例仓库](https://github.com/markdoc/docs/tree/main/examples)集合，或查看[本站源码](https://github.com/markdoc/docs)。

## 循环

Markdoc 不支持直接在文档中编写循环。如果需要遍历内容，请在自定义 [Node](/docs/nodes) 或 [Tag](/docs/tags) 的 `transform` 函数中，或在自定义 [React 组件](/docs/render#react) 中进行。

```js
import { Tag } from '@markdoc/markdoc';

export const group = {
  render: 'Group',
  attributes: {
    items: { type: Array }
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    for (const item of attributes.items) {
      /* 对每个项目执行某些操作 */
    }

    return new Tag('Group', attributes, children);
  }
};
```

{% example %}

```md
{% group items=[1, 2, 3] /%}
```

{% /example %}

## 语法高亮

您可以通过创建自定义 `fence` [节点](/docs/nodes) 为代码块添加语法高亮。此示例展示了如何使用 [Prism](https://prismjs.com/) 实现。

```js
// [源码示例](https://github.com/markdoc/docs/blob/main/components/Code.js)

import 'prismjs';
import 'prismjs/themes/prism.css';

import Prism from 'react-prism';

export function Fence({ children, language }) {
  return (
    <Prism key={language} component="pre" className={`language-${language}`}>
      {children}
    </Prism>
  );
}

const fence = {
  render: 'Fence',
  attributes: {
    language: {
      type: String
    }
  }
};

const content = Markdoc.transform(ast, {
  nodes: {
    fence
  }
});

Markdoc.renderers.react(content, React, {
  components: {
    Fence
  }
});
```

## Switch 语句

您可以使用自定义 Markdoc 标签创建自己的 `switch`/`case` 语义。

```js
import { transformer } from '@markdoc/markdoc';

/** @type {import('@markdoc/markdoc').Config} */
const config = {
  tags: {
    switch: {
      attributes: { primary: { render: false } },
      transform(node, config) {
        const attributes = node.transformAttributes(config);

        const child = node.children.find(
          (child) => child.attributes.primary === attributes.primary
        );

        return child ? transformer.node(child, config) : [];
      }
    },
    case: {
      attributes: { primary: { render: false } }
    }
  }
};
```

然后可以在文档中使用：

{% example %}

```md
{% switch $item %}

{% case 1 %}
Case 1
{% /case %}

{% case 2 %}
Case 2
{% /case %}

{% /switch %}
```

{% /example %}

## 目录

要创建目录，首先从页面内容中收集所有标题：

```js
// [源码示例](https://github.com/markdoc/docs/blob/bae62d06109e3e699778fe901c8015d41b1c7c9f/pages/_app.js#L58-L79)

function collectHeadings(node, sections = []) {
  if (node) {
    // 匹配所有 h1、h2、h3 等标签
    if (node.name.match(/h\d/)) {
      const title = node.children[0];

      if (typeof title === 'string') {
        sections.push({
          ...node.attributes,
          title
        });
      }
    }

    if (node.children) {
      for (const child of node.children) {
        collectHeadings(child, sections);
      }
    }
  }

  return sections;
}

const content = Markdoc.transform(ast);
const headings = collectHeadings(content);
```

然后，将标题渲染为列表：

```js
// [源码示例](https://github.com/markdoc/docs/blob/main/components/Shell/TableOfContents.js)

function TableOfContents({ headings }) {
  const items = headings.filter((item) => [2, 3].includes(item.level));

  return (
    <nav>
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            <a href={`#${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

最后，使用 ID [注解](/docs/syntax#annotations) 为标题添加 ID。

{% example %}

```md
# 我的标题 {% #my-id %}
```

{% /example %}

## 标签页

首先，创建 Markdoc 标签。

```js
import { Tag } from '@markdoc/markdoc';

const tabs = {
  render: 'Tabs',
  attributes: {},
  transform(node, config) {
    const labels = node
      .transformChildren(config)
      .filter((child) => child && child.name === 'Tab')
      .map((tab) => (typeof tab === 'object' ? tab.attributes.label : null));

    return new Tag(this.render, { labels }, node.transformChildren(config));
  }
};

const tab = {
  render: 'Tab',
  attributes: {
    label: {
      type: String
    }
  }
};

/** @type {import('@markdoc/markdoc').Config} */
const config = {
  tags: {
    tabs,
    tab
  }
};
```

然后，创建映射到 `tab` 和 `tabs` 标签的 `Tab` 和 `Tabs` React 组件：

{% sideBySide %}

```js
// components/Tabs.js

import React from 'react';

export const TabContext = React.createContext();

export function Tabs({ labels, children }) {
  const [
    currentTab,
    setCurrentTab
  ] = React.useState(labels[0]);

  {% comment %}
  prettier-ignore-start
  {% /comment %}
  return (
    <TabContext.Provider value={currentTab}>
      <ul role="tablist">
        {labels.map((label) => (
          <li key={label}>
            <button
              role="tab"
              aria-selected={label === currentTab}
              onClick={() => setCurrentTab(label)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
      {children}
    </TabContext.Provider>
  );
  {% comment %}
  prettier-ignore-end
  {% /comment %}
};
```

```js
// components/Tab.js

import React from 'react';
import { TabContext } from './Tabs';

export function Tab({ label, children }) {
  const currentTab = React.useContext(TabContext);

  if (label !== currentTab) {
    return null;
  }

  return children;
}
```

{% /sideBySide %}

并在文档中使用这些标签。

{% example %}

```md
{% tabs %}

{% tab label="React" %}
React 内容放在这里
{% /tab %}

{% tab label="HTML" %}
HTML 内容放在这里
{% /tab %}

{% /tabs %}
```

{% /example %}
