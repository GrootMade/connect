// Cloudflare Worker: Typesense Search Proxy (Service Worker format)

var TYPESENSE_API_KEY = 'ecdma9qczgbvu6pk';
// DNS-only subdomain (grey cloud) → Traefik → Typesense, bypasses CF proxy
var ORIGIN_HOST = 'ts-origin.grootmade.com';

var corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-TYPESENSE-API-KEY',
  'Access-Control-Max-Age': '86400'
};

function isAllowedPath(pathname) {
  if (pathname === '/multi_search') return true;
  if (/^\/collections\/[^/]+\/documents\/search\/?$/.test(pathname)) return true;
  if (pathname === '/health') return true;
  return false;
}

function addCorsHeaders(responseHeaders) {
  var keys = Object.keys(corsHeaders);
  for (var i = 0; i < keys.length; i++) {
    responseHeaders.set(keys[i], corsHeaders[keys[i]]);
  }
}

addEventListener('fetch', function (event) {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  var url = new URL(request.url);

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Block non-search endpoints
  if (!isAllowedPath(url.pathname)) {
    var blockHeaders = new Headers({ 'Content-Type': 'application/json' });
    addCorsHeaders(blockHeaders);
    return new Response(
      JSON.stringify({ message: 'Only search endpoints are allowed' }),
      { status: 403, headers: blockHeaders }
    );
  }

  try {
    // Fetch to origin over HTTPS on standard port (Traefik with Let's Encrypt)
    var originUrl = 'https://' + ORIGIN_HOST + url.pathname + url.search;

    var headers = new Headers(request.headers);
    headers.set('X-TYPESENSE-API-KEY', TYPESENSE_API_KEY);
    headers.delete('cf-connecting-ip');
    headers.delete('cf-ipcountry');
    headers.delete('cf-ray');
    headers.delete('cf-visitor');

    var body = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = request.body;
    }

    var originResponse = await fetch(originUrl, {
      method: request.method,
      headers: headers,
      body: body
    });

    // Read the full body to avoid Cloudflare intercepting the stream
    var responseBody = await originResponse.text();

    var responseHeaders = new Headers();
    responseHeaders.set('Content-Type', originResponse.headers.get('Content-Type') || 'application/json');
    addCorsHeaders(responseHeaders);

    return new Response(responseBody, {
      status: originResponse.status,
      headers: responseHeaders
    });
  } catch (err) {
    var errHeaders = new Headers({ 'Content-Type': 'application/json' });
    addCorsHeaders(errHeaders);
    return new Response(
      JSON.stringify({
        message: 'Origin fetch failed',
        error: err.message,
        hint: 'TLS to origin IP may have failed - consider using a DNS-only subdomain instead'
      }),
      { status: 502, headers: errHeaders }
    );
  }
}
