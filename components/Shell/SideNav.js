import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const items = [
  {
    title: '快速开始',
    links: [
      { href: '/docs/overview', children: '什么是 Markdoc？' },
      { href: '/docs/getting-started', children: '安装' },
      { href: '/docs/faq', children: '常见问题' },
      { href: '/sandbox', children: '试用' }
    ]
  },
  {
    title: '核心概念',
    links: [
      { href: '/docs/syntax', children: '语法与 schema' },
      { href: '/docs/nodes', children: '节点' },
      { href: '/docs/tags', children: '标签' },
      { href: '/docs/attributes', children: '属性' },
      { href: '/docs/variables', children: '变量' },
      { href: '/docs/functions', children: '函数' },
      {
        href: '/docs/render',
        children: '渲染'
      },
      {
        href: '/docs/config',
        children: '配置对象'
      },
      { href: '/docs/validation', children: '校验' }
    ]
  },
  {
    title: '集成指南',
    links: [
      { href: '/docs/examples', children: '常见示例' },
      { href: '/docs/examples/html', children: 'HTML 集成' },
      { href: '/docs/nextjs', children: 'Next.js 集成' },
      { href: '/docs/examples/react', children: 'React 集成' }
    ]
  },
  {
    title: '进阶概念',
    links: [
      { href: '/docs/frontmatter', children: 'Frontmatter' },
      { href: '/docs/partials', children: '局部模板' },
      { href: '/docs/format', children: '格式化' }
    ]
  }
];

export function SideNav() {
  const router = useRouter();

  return (
    <nav className="sidenav">
      {items.map((item) => (
        <div key={item.title}>
          <h3>{item.title}</h3>
          <ul className="flex column">
            {item.links.map((link) => {
              const active = router.pathname === link.href;
              return (
                <li key={link.href} className={active ? 'active' : ''}>
                  <Link {...link}>{link.children}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <style jsx>
        {`
          nav {
            /* https://stackoverflow.com/questions/66898327/how-to-keep-footer-from-pushing-up-sticky-sidebar */
            position: sticky;
            top: var(--nav-height);
            height: calc(100vh - var(--nav-height));
            flex: 0 0 240px;
            overflow-y: auto;
            padding: 2rem 0 2rem 2rem;
          }
          h3 {
            font-weight: 500;
            margin: 0.5rem 0 0;
            padding-bottom: 0.5rem;
          }
          ul {
            margin: 0;
            padding: 0;
          }
          li {
            list-style-type: none;
            margin: 0 0 0.7rem 0.7rem;
            font-size: 14px;
            font-weight: 400;
          }
          li a {
            text-decoration: none;
          }
          li a:hover,
          li.active > a {
            text-decoration: underline;
          }
          @media screen and (max-width: 600px) {
            nav {
              display: none;
            }
          }
        `}
      </style>
    </nav>
  );
}
