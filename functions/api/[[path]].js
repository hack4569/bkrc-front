const BACKEND = 'http://54-180-172-47.nip.io:8080'
const ALADIN_SEARCH_URL = 'https://www.aladin.co.kr/ttb/api/ItemSearch.aspx'

export async function onRequest(context) {
  const { request, params, env } = context
  const url = new URL(request.url)
  const path = params.path ? params.path.join('/') : ''

  if (path === 'aladin/search') {
    if (request.method !== 'GET') {
      return Response.json({ detail: '허용되지 않은 요청 방식입니다.' }, { status: 405 })
    }

    const query = url.searchParams.get('Query')?.trim()
    if (!query) {
      return Response.json({ detail: '검색어를 입력해주세요.' }, { status: 400 })
    }
    if (!env.ALADIN_TTB_KEY) {
      return Response.json({ detail: '알라딘 API 키가 설정되지 않았습니다.' }, { status: 500 })
    }

    const searchParams = new URLSearchParams({
      ttbkey: env.ALADIN_TTB_KEY,
      Query: query,
      QueryType: 'Keyword',
      SearchTarget: 'Book',
      MaxResults: '10',
      start: '1',
      Cover: 'MidBig',
      output: 'JS',
      Version: '20131101',
    })
    const upstream = await fetch(`${ALADIN_SEARCH_URL}?${searchParams}`)
    const responseHeaders = new Headers(upstream.headers)
    responseHeaders.set('Cache-Control', 'private, max-age=60')
    responseHeaders.delete('set-cookie')

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    })
  }

  const target = `${BACKEND}/${path}${url.search}`

  const headers = new Headers(request.headers)
  headers.delete('host')

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  })

  // /api는 앱과 동일 출처이므로 CORS 허용 헤더가 불필요하다.
  // 와일드카드 ACAO는 외부 사이트가 이 프록시를 통해 백엔드를 호출하는
  // 오픈 릴레이가 되므로 두지 않는다.
  const resHeaders = new Headers(upstream.headers)
  resHeaders.delete('Access-Control-Allow-Origin')

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  })
}
