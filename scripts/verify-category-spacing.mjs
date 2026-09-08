import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../public/css/app.css', import.meta.url), 'utf8')
const nonMarginOpticalSpaceByRole = {
  insight: [11.76, 11.31, 10.06, 10.5],
  description: [10.27, 10.72, 9.42, 9.47],
  essence: [7.85, 7.31, 6.5, 7.04],
  quote: [10.34, 10.34, 9.16, 9.09],
  toc: [3.98, 3.98, 3.98, 3.98],
  md: [10.15, 10.09, 9.26, 8.8],
}
const viewportHeights = [844, 818, 740, 670]

const contracts = [
  {
    role: 'insight',
    selector: '.summary-content-section__content--insight',
    expectedMargin: 13,
    targetOpticalGap: 24,
    typography: ["font-family: 'RIDIBatang'", 'font-style: normal', 'font-size: 29px', 'font-weight: 400', 'line-height: 1.72', 'letter-spacing: -0.44px'],
  },
  {
    role: 'description',
    selector: '.summary-content-section__content--description',
    expectedMargin: 14,
    targetOpticalGap: 24,
    typography: ["font-family: 'Noto Serif KR'", 'font-style: normal', 'font-size: 28px', 'font-weight: 300', 'line-height: 1.58', 'letter-spacing: -0.4px'],
  },
  {
    role: 'essence',
    selector: '.summary-content-section__content--ai',
    expectedMargin: 17,
    targetOpticalGap: 24,
    typography: ["font-family: 'RIDIBatang'", 'font-style: normal', 'font-size: 29px', 'font-weight: 400', 'line-height: 1.45', 'letter-spacing: -0.44px'],
  },
  {
    role: 'quote',
    selector: '.summary-content-section--quote .summary-content-section__content',
    expectedMargin: 18,
    targetOpticalGap: 28,
    typography: ["font-family: 'Maru Buri'", 'font-style: normal', 'font-size: 26px', 'font-weight: 400', 'line-height: 1.74', 'letter-spacing: -0.35px'],
  },
  {
    role: 'toc',
    selector: '.toc-list',
    expectedMargin: 20,
    targetOpticalGap: 24,
    typography: ['padding: 0', 'list-style: none'],
  },
  {
    role: 'md',
    selector: '.summary-content-section__content--md',
    expectedMargin: 14,
    targetOpticalGap: 24,
    typography: ["font-family: 'Noto Serif KR'", 'font-style: normal', 'font-size: 26px', 'font-weight: 300', 'line-height: 1.6', 'letter-spacing: -0.3px'],
  },
]

function blockFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\ /g, '\\s+')
  const matches = [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 'g'))]
  assert.ok(matches.length > 0, `${selector} 규칙이 없다`)
  const marginMatch = matches.filter((match) => /margin(?:-top)?:\s*-?\d/.test(match[1])).at(-1)
  assert.ok(marginMatch, `${selector}의 margin 규칙이 없다`)
  return { marginBlock: marginMatch[1], allBlocks: matches.map((match) => match[1]).join('\n') }
}

for (const contract of contracts) {
  const { marginBlock, allBlocks } = blockFor(contract.selector)
  const margin = Number(marginBlock.match(/margin-top:\s*(-?\d+(?:\.\d+)?)px|margin:\s*(-?\d+(?:\.\d+)?)px/)?.slice(1).find(Boolean))
  assert.equal(margin, contract.expectedMargin, `${contract.role} margin-top 계약 불일치`)
  for (const property of contract.typography) {
    assert.ok(allBlocks.includes(property), `${contract.role} 조판 속성 변경: ${property}`)
  }

  for (const [index, nonMarginOpticalSpace] of nonMarginOpticalSpaceByRole[contract.role].entries()) {
    const opticalGap = margin + nonMarginOpticalSpace
    assert.ok(
      Math.abs(opticalGap - contract.targetOpticalGap) <= 2,
      `${contract.role} ${viewportHeights[index]}px 광학 간격 ${opticalGap.toFixed(2)}px (목표 ${contract.targetOpticalGap}±2px)`,
    )
  }
}

assert.doesNotMatch(css, /@media[^{}]*\{[\s\S]*?(?:summary-content-section__content--insight|summary-content-section__content--description|summary-content-section__content--ai|summary-content-section__content--md|toc-list)[\s\S]*?margin-top:/, '미디어쿼리 간격 보정 금지')

console.log('카테고리 광학 간격 계약 4 높이 × 6 역할 통과')
