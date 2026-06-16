const BACKEND = 'http://54-180-172-47.nip.io:8080'

export async function onRequest(context) {
  const { request, params } = context
  const url = new URL(request.url)
  const path = params.path ? params.path.join('/') : ''
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
