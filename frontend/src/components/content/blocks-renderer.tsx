import Image from 'next/image'
import type { ReactNode } from 'react'

import { getMediaUrl } from '@/lib/strapi/client'
import type { BlocksNode, TextNode } from '@/lib/strapi/types'

function isTextNode(node: BlocksNode | TextNode): node is TextNode {
  return node.type === 'text'
}

function safeHref(href?: string): string | undefined {
  if (!href) return undefined
  if (href.startsWith('/') || href.startsWith('#')) return href
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href
  return undefined
}

function renderText(node: TextNode, key: string): ReactNode {
  let content: ReactNode = node.text

  if (node.code) content = <code>{content}</code>
  if (node.bold) content = <strong>{content}</strong>
  if (node.italic) content = <em>{content}</em>
  if (node.underline) content = <u>{content}</u>
  if (node.strikethrough) content = <s>{content}</s>

  return <span key={key}>{content}</span>
}

function renderChildren(children: BlocksNode['children'], parentKey: string): ReactNode[] {
  return (children ?? []).map((child, index) =>
    isTextNode(child)
      ? renderText(child, `${parentKey}-text-${index}`)
      : renderBlock(child, `${parentKey}-block-${index}`),
  )
}

function renderBlock(node: BlocksNode, key: string): ReactNode {
  const children = renderChildren(node.children, key)

  if (node.type === 'heading') {
    if (node.level === 2) return <h2 key={key}>{children}</h2>
    if (node.level === 3) return <h3 key={key}>{children}</h3>
    if (node.level === 4) return <h4 key={key}>{children}</h4>
    return <h2 key={key}>{children}</h2>
  }

  if (node.type === 'list') {
    return node.format === 'ordered' ? (
      <ol key={key}>{children}</ol>
    ) : (
      <ul key={key}>{children}</ul>
    )
  }

  if (node.type === 'list-item') return <li key={key}>{children}</li>
  if (node.type === 'quote') return <blockquote key={key}>{children}</blockquote>

  if (node.type === 'link') {
    const href = safeHref(node.url)
    return href ? (
      <a href={href} key={key} rel="noreferrer">
        {children}
      </a>
    ) : (
      <span key={key}>{children}</span>
    )
  }

  if (node.type === 'image' && node.image) {
    const src = getMediaUrl(node.image.url)
    if (!src) return null

    return (
      <figure key={key}>
        <Image
          alt={node.image.alternativeText ?? node.image.name}
          height={node.image.height}
          src={src}
          width={node.image.width}
        />
        {node.image.caption && <figcaption>{node.image.caption}</figcaption>}
      </figure>
    )
  }

  return <p key={key}>{children}</p>
}

export function BlocksRenderer({ content }: { content?: BlocksNode[] | null }) {
  if (!content?.length) return null

  return (
    <div className="prose-catalogue">
      {content.map((node, index) => renderBlock(node, `root-${index}`))}
    </div>
  )
}
