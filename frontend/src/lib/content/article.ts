import type { BlocksNode, TextNode } from '@/lib/strapi/types'

export type ArticleTocItem = {
  id: string
  label: string
}

export type NormalizedArticle = {
  content: BlocksNode[]
  ctaDescription?: string
  ctaTitle?: string
  readingMinutes: number
  toc: ArticleTocItem[]
}

function isTextNode(node: BlocksNode | TextNode): node is TextNode {
  return node.type === 'text'
}

export function getBlockText(node: BlocksNode | TextNode): string {
  if (isTextNode(node)) return node.text
  return (node.children ?? []).map(getBlockText).join('').trim()
}

export function slugifyArticleHeading(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function isParagraph(node: BlocksNode): boolean {
  return node.type === 'paragraph'
}

function isEmptyParagraph(node: BlocksNode): boolean {
  return isParagraph(node) && !getBlockText(node)
}

function looksLikeHeading(value: string): boolean {
  if (/^\d+[.)]\s+/.test(value)) return true
  if (value.length > 80 || value.endsWith('.') || value.endsWith(':')) return false
  if (value.endsWith('?')) return true

  const words = value.split(/\s+/).filter(Boolean)
  if (words.length < 2 || words.length > 9) return false

  const minorWords = new Set(['a', 'an', 'and', 'for', 'in', 'is', 'of', 'or', 'the', 'to', 'with'])
  const meaningfulWords = words.filter((word) => !minorWords.has(word.toLocaleLowerCase()))
  const capitalizedWords = meaningfulWords.filter((word) => /^[A-Z0-9]/.test(word))

  return meaningfulWords.length > 0 && capitalizedWords.length / meaningfulWords.length >= 0.75
}

function findNextText(content: BlocksNode[], startIndex: number): { index: number; text: string } | null {
  for (let index = startIndex; index < content.length; index += 1) {
    const text = getBlockText(content[index])
    if (text) return { index, text }
  }
  return null
}

export function normalizeArticleContent(content: BlocksNode[]): NormalizedArticle {
  const normalized: BlocksNode[] = []
  const toc: ArticleTocItem[] = []
  let ctaTitle: string | undefined
  let ctaDescription: string | undefined

  for (let index = 0; index < content.length; index += 1) {
    const node = content[index]
    const text = getBlockText(node)

    if (!text && isEmptyParagraph(node)) continue

    if (text.toLocaleUpperCase() === 'CTA') {
      const title = findNextText(content, index + 1)
      const description = title ? findNextText(content, title.index + 1) : null
      ctaTitle = title?.text
      ctaDescription = description?.text
      break
    }

    if (isParagraph(node) && /^Relevant\s+.+Product:/i.test(text)) {
      normalized.push({ ...node, type: 'quote' })
      continue
    }

    if (isParagraph(node) && looksLikeHeading(text)) {
      const id = slugifyArticleHeading(text)
      normalized.push({ ...node, level: 2, type: 'heading' })
      toc.push({ id, label: text })
      continue
    }

    if (isParagraph(node) && text.endsWith(':')) {
      let itemIndex = index + 1
      while (itemIndex < content.length && isEmptyParagraph(content[itemIndex])) itemIndex += 1

      const listItems: BlocksNode[] = []
      while (
        itemIndex < content.length &&
        isParagraph(content[itemIndex]) &&
        Boolean(getBlockText(content[itemIndex]))
      ) {
        listItems.push({
          children: content[itemIndex].children,
          type: 'list-item',
        })
        itemIndex += 1
      }

      if (listItems.length >= 2) {
        normalized.push(node)
        normalized.push({ children: listItems, format: 'unordered', type: 'list' })
        index = itemIndex - 1
        continue
      }
    }

    normalized.push(node)
  }

  const wordCount = normalized
    .map(getBlockText)
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return {
    content: normalized,
    ctaDescription,
    ctaTitle,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 220)),
    toc,
  }
}
