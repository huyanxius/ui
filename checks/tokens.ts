import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'

interface Options {
  semanticRadii?: boolean
}

const arbitraryUtility =
  /(?<![\w-])(?:text|bg|border|rounded(?:-[a-z]{1,2})?|max-w|min-w|w|h|ring|size|p|m|gap|duration)-\[[^\]]+\]/u
const paletteColor =
  /(?<![\w-])(?:bg|text|border(?:-[trblsexy])?|ring(?:-offset)?|outline|fill|stroke|decoration|accent|caret|from|via|to|divide|shadow)-(?:white|black|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe)(?:-\d+)?(?![\w-])/u
const fixedRadius =
  /(?<![\w-])rounded(?:-[trblse]{1,2})?(?:-(?:xs|sm|md|lg|\d*xl|full))?(?=[\s!\]]|$)/u
const radiusProperty = /\bborder\w*Radius\s*:/u
const colorProperty = /(?:color|background|fill|stroke|shadow)/iu
const svgColor = /^(?:color|fill|stroke|stopColor|floodColor)$/u

/** 检查 JSX 和 cva 等变体中的字面量，动态类名由调用方负责使用语义令牌。 */
export function findTokenViolations(
  source: string,
  { semanticRadii = false }: Options = {},
): string[] {
  const errors = new Set<string>()
  const tree = ts.createSourceFile(
    'component.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

  function visit(node: ts.Node) {
    if (ts.isStringLiteralLike(node) || ts.isTemplateLiteralToken(node)) {
      if (arbitraryUtility.test(node.text)) errors.add('arbitrary utility')
      if (paletteColor.test(node.text)) errors.add('palette color')
      if (semanticRadii && fixedRadius.test(node.text)) errors.add('fixed radius')
    }

    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(tree)
      const value = node.initializer?.getText(tree) ?? ''
      if (name === 'style') {
        if (colorProperty.test(value)) errors.add('inline color')
        if (semanticRadii && radiusProperty.test(value)) errors.add('fixed radius')
      }
      const expression =
        node.initializer && ts.isJsxExpression(node.initializer)
          ? node.initializer.expression
          : node.initializer
      if (
        svgColor.test(name) &&
        expression &&
        ts.isStringLiteralLike(expression) &&
        !/^(?:none|inherit|currentColor|transparent|var\(|url\()/iu.test(expression.text)
      ) {
        errors.add('inline color')
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(tree)
  return [...errors]
}

export function checkTokens(directory: string, options?: Options): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return checkTokens(path, options)
    if (!/\.[jt]sx$/u.test(entry.name) || /\.(?:spec|test)\.[jt]sx$/u.test(entry.name)) return []
    return findTokenViolations(readFileSync(path, 'utf8'), options).map(
      (error) => `${path}: ${error}`,
    )
  })
}
