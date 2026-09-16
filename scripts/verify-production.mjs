const BASE = (process.env.PRODUCTION_BASE_URL || 'https://get-the-point.netlify.app').replace(/\/$/, '');
const MAX_ATTEMPTS = Number(process.env.PRODUCTION_SMOKE_ATTEMPTS || 12);
const RETRY_MS = Number(process.env.PRODUCTION_SMOKE_RETRY_MS || 5000);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, { redirect = 'manual' } = {}) {
  const response = await fetch(`${BASE}${path}`, {
    redirect,
    headers: { 'user-agent': 'decisions-decisions-production-smoke/2.2' },
    signal: AbortSignal.timeout(12_000)
  });
  const text = await response.text();
  return { response, text };
}

function expectHeader(response, name, predicate, description) {
  const value = response.headers.get(name) || '';
  assert(predicate(value), `${description}: ${name}=${JSON.stringify(value)}`);
}

async function waitForCurrentPublicSurface() {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const { response, text } = await request('/', { redirect: 'follow' });
      assert(response.status === 200, `home expected 200, got ${response.status}`);
      assert(text.includes('DECISIONS, DECISIONS'), 'home missing DECISIONS, DECISIONS identity');
      assert(text.includes('ONE PROMPT. THREE WAYS TO PLAY.'), 'home missing descriptor');
      assert(!text.includes('GET THE POINT'), 'home leaked former lead identity');
      console.log(`Production surface ready on attempt ${attempt}.`);
      return { response, text };
    } catch (error) {
      lastError = error;
      console.warn(`Production surface attempt ${attempt}/${MAX_ATTEMPTS} failed: ${error.message}`);
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_MS);
    }
  }
  throw lastError || new Error('Production surface did not become ready');
}

async function verifyPublicSurface() {
  console.log('Checking live public surface...');
  const { response, text } = await waitForCurrentPublicSurface();
  expectHeader(response, 'cache-control', value => /no-cache|no-store/i.test(value), 'home cache policy');
  expectHeader(response, 'x-content-type-options', value => value.toLowerCase() === 'nosniff', 'home security policy');
  expectHeader(response, 'x-frame-options', value => /sameorigin/i.test(value), 'home framing policy');
  expectHeader(response, 'permissions-policy', value => value.includes('camera=()') && value.includes('microphone=()') && value.includes('geolocation=()'), 'home permissions policy');
  assert(/<title>[^<]*DECISIONS, DECISIONS[^<]*<\/title>/i.test(text), 'home title does not carry current identity');

  for (const [path, needle] of [
    ['/how', 'SEE THE PROMPT. WEIGH THE POINTS. PICK YOUR MOVE.'],
    ['/playtest', 'PLAY IT COLD. TELL US WHAT HAPPENS.'],
    ['/faq', 'THE SHORT ANSWERS FIRST.'],
    ['/about', 'THE INTERESTING PART HAPPENS BEFORE THE CLUE.']
  ]) {
    const result = await request(path, { redirect: 'follow' });
    assert(result.response.status === 200, `${path} expected 200, got ${result.response.status}`);
    assert(result.text.includes('DECISIONS, DECISIONS'), `${path} missing current identity`);
    assert(result.text.includes(needle), `${path} missing expected v2.2 copy`);
  }

  const playtest = await request('/playtest', { redirect: 'follow' });
  // Netlify's deploy post-processing can rewrite or remove authoring-only form
  // attributes. Live smoke therefore verifies the durable recruitment surface;
  // source invariants + Netlify platform metadata verify form registration.
  assert(playtest.text.includes('id="pt-name"'), 'playtest recruitment name field missing');
  assert(playtest.text.includes('id="pt-email"'), 'playtest recruitment email field missing');
  assert(playtest.text.includes('action="/thanks"'), 'playtest recruitment form missing expected success action');
  assert(playtest.text.includes('Join a playtest'), 'playtest recruitment CTA missing');
  console.log('Live public surface contract passed.');
}

async function verifyPrivateAccessBoundary() {
  console.log('Checking live private-access boundary...');
  for (const path of ['/play', '/diagnostics', '/analysis', '/feedback']) {
    const { response } = await request(path, { redirect: 'manual' });
    assert(response.status === 303, `${path} expected unauthorized 303, got ${response.status}`);
    const location = response.headers.get('location') || '';
    assert(location.includes('/demo-access'), `${path} did not redirect to demo access: ${location}`);
    expectHeader(response, 'cache-control', value => /no-store/i.test(value), `${path} redirect cache policy`);
    expectHeader(response, 'x-robots-tag', value => /noindex/i.test(value) && /nofollow/i.test(value), `${path} redirect robots policy`);
  }

  const access = await request('/demo-access', { redirect: 'follow' });
  assert(access.response.status === 200, `demo access expected 200, got ${access.response.status}`);
  assert(access.text.includes('DECISIONS, DECISIONS'), 'demo access missing current identity');
  expectHeader(access.response, 'cache-control', value => /no-store|no-cache/i.test(value), 'demo access cache policy');
  expectHeader(access.response, 'x-robots-tag', value => /noindex/i.test(value) && /nofollow/i.test(value), 'demo access robots policy');
  expectHeader(access.response, 'content-security-policy', value => value.includes("default-src 'self'") && value.includes("object-src 'none'"), 'demo access CSP');
  expectHeader(access.response, 'permissions-policy', value => value.includes('camera=()') && value.includes('microphone=()') && value.includes('geolocation=()'), 'demo access permissions policy');
  console.log('Live private-access boundary passed.');
}

async function verifyPwaContract() {
  console.log('Checking live PWA contract...');
  const manifest = await request('/manifest.webmanifest', { redirect: 'follow' });
  assert(manifest.response.status === 200, `manifest expected 200, got ${manifest.response.status}`);
  const data = JSON.parse(manifest.text);
  assert(data.name === 'DECISIONS, DECISIONS — Private Playtest', `unexpected manifest name: ${data.name}`);
  assert(data.short_name === 'Decisions', `unexpected manifest short_name: ${data.short_name}`);
  assert(data.start_url === '/play', `unexpected manifest start_url: ${data.start_url}`);
  expectHeader(manifest.response, 'content-type', value => value.includes('application/manifest+json'), 'manifest content type');

  const sw = await request('/sw.js', { redirect: 'follow' });
  assert(sw.response.status === 200, `service worker expected 200, got ${sw.response.status}`);
  expectHeader(sw.response, 'cache-control', value => /no-cache|no-store/i.test(value), 'service worker cache policy');
  expectHeader(sw.response, 'service-worker-allowed', value => value === '/', 'service worker scope');
  console.log('Live PWA contract passed.');
}

async function main() {
  console.log(`Production smoke target: ${BASE}`);
  await verifyPublicSurface();
  await verifyPrivateAccessBoundary();
  await verifyPwaContract();
  console.log('Production smoke passed: public identity, recruitment surface, Netlify access boundary, security headers, and PWA contract are live.');
}

main().catch(error => {
  console.error(`PRODUCTION SMOKE FAILED: ${error.stack || error.message}`);
  process.exitCode = 1;
});
