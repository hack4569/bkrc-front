import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const component = readFileSync(new URL('../src/components/SummaryCard.tsx', import.meta.url), 'utf8')
const css = readFileSync(new URL('../public/css/app.css', import.meta.url), 'utf8')
const fonts = readFileSync(new URL('../public/css/font.css', import.meta.url), 'utf8')
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const fixture = readFileSync(new URL('../src/mock/typographyFixture.ts', import.meta.url), 'utf8')
const hook = readFileSync(new URL('../src/hooks/useBooksWithFavorites.ts', import.meta.url), 'utf8')

const expectedClasses = [
  "descriptionInsight: ' summary-content-section__content--essence summary-content-section__content--insight'",
  "description: ' summary-content-section__content--description'",
  "ai: ' summary-content-section__content--essence summary-content-section__content--ai'",
  "md: ' summary-content-section__content--md'",
  "user: ' summary-content-section__content--user'",
]
for (const expected of expectedClasses) {
  assert.ok(component.includes(expected), `역할별 클래스 누락: ${expected}`)
}

const contracts = [
  ['Insight', /\.summary-content-section__content--insight\s*\{[^}]*font-family:\s*'RIDIBatang'[^}]*font-style:\s*normal[^}]*font-size:\s*29px[^}]*font-weight:\s*400[^}]*line-height:\s*1\.72[^}]*letter-spacing:\s*-0\.44px/s],
  ['소개', /\.summary-content-section__content--description\s*\{[^}]*font-family:\s*'Noto Serif KR'[^}]*font-style:\s*normal[^}]*font-size:\s*28px[^}]*font-weight:\s*300[^}]*line-height:\s*1\.58[^}]*letter-spacing:\s*-0\.4px/s],
  ['Essence', /\.summary-content-section__content--ai\s*\{[^}]*font-family:\s*'RIDIBatang'[^}]*font-style:\s*normal[^}]*font-size:\s*29px[^}]*font-weight:\s*400[^}]*line-height:\s*1\.45[^}]*letter-spacing:\s*-0\.44px/s],
  ['인용문', /\.summary-content-section--quote \.summary-content-section__content\s*\{[^}]*font-family:\s*'Maru Buri'[^}]*font-style:\s*normal[^}]*font-size:\s*26px[^}]*font-weight:\s*400[^}]*line-height:\s*1\.74[^}]*letter-spacing:\s*-0\.35px/s],
  ['목차', /\.toc-list__index,\s*\.toc-list__text\s*\{[^}]*font-family:\s*'IBM Plex Sans KR'[^}]*font-style:\s*normal/s],
  ['MD 추천', /\.summary-content-section__content--md\s*\{[^}]*font-family:\s*'Noto Serif KR'[^}]*font-style:\s*normal[^}]*font-size:\s*26px[^}]*font-weight:\s*300[^}]*line-height:\s*1\.6[^}]*letter-spacing:\s*-0\.3px/s],
]
for (const [name, pattern] of contracts) {
  assert.match(css, pattern, `${name} 혼합 조판 계약 불일치`)
}

assert.match(hook, /import\.meta\.env\.DEV\s*&&\s*new URLSearchParams\(window\.location\.search\)\.has\('typographyFixture'\)/, '검수 fixture의 개발 환경 가드 누락')
for (const [name, length] of [['insight', 149], ['description', 157], ['essence', 68], ['quote', 143]]) {
  assert.match(fixture, new RegExp(`${name}: atLength\\([\\s\\S]*?, ${length}\\)`), `${name} fixture 글자 수 계약 불일치`)
}

const requiredFontResources = [
  ['마루부리 CSS', 'https://cdn.jsdelivr.net/gh/fonts-archive/MaruBuri/subsets/MaruBuri-dynamic-subset.css', 100],
  ['리디바탕 WOFF2', 'https://cdn.jsdelivr.net/gh/fonts-archive/RIDIBatang/RIDIBatang.woff2', 100_000],
  ['Noto Serif KR CSS', 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;600&display=swap', 100],
  ['IBM Plex Sans KR CSS', 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400&display=swap', 100],
]
const documentResources = [
  ...[...fonts.matchAll(/url\(['"]?(https:[^'")]+)['"]?\)/g)].map(([, url]) => url),
  ...[...html.matchAll(/<link[^>]+href=["'](https:[^"']+)["']/g)].map(([, url]) => url),
]
for (const [name, url] of requiredFontResources) {
  assert.ok(documentResources.includes(url), `${name} 실제 문서 URL 누락: ${url}`)
}

for (const [name, url, minimumBytes] of requiredFontResources) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
  assert.equal(response.status, 200, `${name} HTTP 상태 불일치: ${response.status}`)
  const body = new Uint8Array(await response.arrayBuffer())
  assert.ok(body.byteLength >= minimumBytes, `${name} 응답 크기가 너무 작음: ${body.byteLength}`)
}

const mixedSection = css.split('/* 고객 선택 혼합 조판 시작 */')[1]?.split('/* 고객 선택 혼합 조판 끝 */')[0] ?? ''
assert.doesNotMatch(mixedSection, /font-style:\s*(?:italic|oblique)\b/, '혼합 조판 범위에 합성 기울임 금지')

for (const forbidden of ['border:', 'padding:', 'text-align:', 'text-indent:', '::before', '::after']) {
  assert.ok(!mixedSection.includes(forbidden), `혼합 조판 범위 밖 구조 변경: ${forbidden}`)
}

console.log('혼합 조판 계약 6/6 통과')
