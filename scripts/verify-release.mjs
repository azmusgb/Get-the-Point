import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;
let warnings = 0;

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function exists(file) {
  return fs.existsSync(path.join(root, file));
}
function ok(condition, message) {
  if (condition) console.log(`PASS  ${message}`);
  else {
    console.error(`FAIL  ${message}`);
    failures += 1;
  }
}
function warn(condition, message) {
  if (condition) console.log(`PASS  ${message}`);
  else {
    console.warn(`WARN  ${message}`);
    warnings += 1;
  }
}
function parseCsvLine(line) {
  const out = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      out.push(value);
      value = '';
    } else {
      value += ch;
    }
  }
  out.push(value);
  return out;
}

console.log('DECISIONS, DECISIONS — Web v2.2 release verification\n');

const requiredFiles = [
  'home.html','how.html','playtest.html','about.html','faq.html','press.html','partners.html','retail.html','manufacturing.html','launch.html','contact.html','privacy.html','thanks.html','archive.html',
  'public-demo.js','css/tokens.css','css/site.css','css/navigation.css','css/home.css','site-nav.js',
  'play.html','play.js','play-runtime.js','playtest-enhancements.js','play-smart-card.js','css/game.css','css/game-smart-card.css','sw.js','manifest.webmanifest','icon.svg',
  'demo-access.html','diagnostics.html','diagnostics.js','analysis.html','analysis.js','feedback.html',
  'netlify.toml','netlify/edge-functions/demo-access.ts','netlify/edge-functions/site-shell.ts',
  'PLAYTEST_ACCEPTANCE_v0.6.md','BLIND_TEST_PROTOCOL_v0.6.md','PLAYTEST_EVIDENCE_SCHEMA_v0.6.md','MECHANICS_UI_NOTES_v4.md','UX_FUNCTIONALITY_V6.md',
  'PRODUCT_TRUTH.md','CSS_ARCHITECTURE_v7.md','README.md',
  'content/prompt-candidates-v0.6.csv','content/README.md'
];
requiredFiles.forEach(file => ok(exists(file), `required file exists: ${file}`));

const publicPageFiles = ['home.html','how.html','playtest.html','about.html','faq.html','press.html','partners.html','retail.html','manufacturing.html','launch.html','contact.html','privacy.html'];
const publicPages = publicPageFiles.map(file => read(file)).join('\n');
const home = read('home.html');
const how = read('how.html');
const playtest = read('playtest.html');
const play = read('play.html');
const siteNav = read('site-nav.js');
const publicDemo = read('public-demo.js');
const sw = read('sw.js');
const manifest = read('manifest.webmanifest');
const icon = read('icon.svg');
const productTruth = read('PRODUCT_TRUTH.md');
const readme = read('README.md');
const feedback = read('feedback.html');
const analysis = read('analysis.html');
const analysisJs = read('analysis.js');
const game = read('play.js');
const edgeGate = read('netlify/edge-functions/demo-access.ts');
const shell = read('netlify/edge-functions/site-shell.ts');
const config = read('netlify.toml');
const acceptance = read('PLAYTEST_ACCEPTANCE_v0.6.md');
const evidence = read('PLAYTEST_EVIDENCE_SCHEMA_v0.6.md');

// Current public identity and page shell.
ok(/DECISIONS, DECISIONS/.test(home), 'homepage presents DECISIONS, DECISIONS');
ok(/ONE PROMPT\. THREE WAYS TO PLAY\./.test(home), 'homepage preserves primary descriptor');
ok(/hero-wordmark/.test(home) && /<span>DECISIONS,<\/span><span>DECISIONS<\/span>/.test(home), 'homepage uses stacked repeated-title wordmark');
ok(/\/css\/navigation\.css\?v=13/.test(home) && /\/site-nav\.js\?v=13/.test(home), 'homepage loads navigation v13');
ok(/\/css\/home\.css\?v=4/.test(home), 'homepage loads Decisions Decisions composition v4');
ok(/public-demo\.js\?v=5/.test(home) && /public-demo\.js\?v=5/.test(how), 'public mechanic teaser is current on home and how pages');
ok(/data-public-demo/.test(home) && /data-route="hum"/.test(home) && /data-route="draw"/.test(home) && /data-route="mime"/.test(home), 'homepage visibly demonstrates the three-route choice');
ok(/YOUR MOVE/.test(home) && /TAP ONE TO COMMIT/.test(home), 'homepage uses current functional choice language');
ok(/WEIGH/.test(home) && /COMMIT/.test(home), 'homepage makes the tradeoff and commitment visible');
ok(!/<iframe[^>]+\/play(?:\.html)?/i.test(home), 'homepage does not embed the protected demo');
ok(!/<title>[^<]*GET THE POINT/i.test(publicPages) && !/<a class="brand"[^>]*>GET THE POINT<\/a>/i.test(publicPages), 'active public page titles and brand marks use current identity');
ok(!publicPages.includes('◒'), 'active public pages contain no stale MIME placeholder icon');

// Shared brand slot remains replaceable while legal clearance is open.
ok(/const BRAND = 'DECISIONS, DECISIONS'/.test(siteNav), 'shared shell centralizes current brand string');
ok(/LEGACY_BRAND = 'GET THE POINT'/.test(siteNav), 'shared shell can migrate remaining nonhistorical legacy labels');
ok(/MutationObserver/.test(siteNav) && /home-brand h1\.brand/.test(siteNav), 'dynamic PWA brand is patched without coupling title to game state');
ok(/setupSkipLink/.test(siteNav), 'shared navigation retains keyboard skip-link support');
ok(/aria-modal="true"/.test(siteNav) && /toggleAttribute\('inert'/.test(siteNav), 'mobile drawer remains modal and background-inert');
ok(/NAV_VERSION = "13"/.test(shell), 'edge site shell is aligned to navigation v13');

// Public decision demo behavior and accessibility.
ok(/is-committed/.test(publicDemo) && /LOCKED IN/.test(publicDemo), 'public demo shows irreversible commitment feedback');
ok(/choiceMs/.test(publicDemo) && /performance\.now/.test(publicDemo), 'public demo measures choice time');
ok(/decisiondemo:committed/.test(publicDemo), 'public demo emits a choice/commit event for future instrumentation');
ok(/aria-pressed/.test(publicDemo) && /aria-disabled/.test(publicDemo), 'public demo exposes committed state to assistive technology');
ok(/ArrowRight/.test(publicDemo) && /ArrowLeft/.test(publicDemo), 'public demo supports keyboard route navigation');
ok(/prefers-reduced-motion/.test(publicDemo), 'public demo respects reduced-motion preference');

// Current product truth and evidence model.
ok(/# DECISIONS, DECISIONS — Repository Product Truth v2\.2/.test(productTruth), 'repository product truth is v2.2');
ok(/NEEDS LEGAL VALIDATION/.test(productTruth), 'working title remains explicitly legal-gated');
ok(/Decision tension/i.test(productTruth), 'product truth includes decision tension as a content gate');
ok(/former lead \/ benchmark fallback/.test(productTruth), 'former naming lead is preserved as historical/fallback context');
ok(/Repository and Netlify project identifiers still retain/.test(readme), 'README explains why technical slugs remain unchanged');
ok(/decision tension/i.test(readme), 'README documents decision-tension evidence requirement');
ok(/decision_tension/.test(feedback), 'feedback form captures decision tension');
ok(/choice time|time spent choosing|how long they hesitate/i.test(playtest), 'playtest recruitment explains choice-time evidence');
ok(/choiceMs/.test(evidence) && /decisionMs/.test(evidence), 'evidence contract preserves choice-time field compatibility');
ok(/Decision tension/i.test(evidence), 'evidence contract defines multi-signal decision-tension review');
ok(/DECISIONS, DECISIONS/.test(acceptance), 'acceptance gate targets current identity');

// PWA identity/cache and protected routes.
ok(/DECISIONS, DECISIONS/.test(play), 'PWA shell metadata uses current identity');
ok(/Decisions, Decisions/.test(play), 'iOS PWA title uses current identity');
ok(/DECISIONS, DECISIONS — Private Playtest/.test(manifest), 'manifest uses current PWA name');
ok(/"short_name": "Decisions"/.test(manifest), 'manifest keeps install short name compact');
ok(/D,/.test(icon) && !/GET/.test(icon) && !/POINT/.test(icon), 'app icon no longer embeds legacy GET/POINT wordmark');
ok(/dd-pwa-v18-decisions-decisions-web-v2-2/.test(sw), 'service-worker cache generation is current');
ok(/site-nav\.js\?v=13/.test(sw) && /navigation\.css\?v=13/.test(sw), 'service worker caches navigation v13');
ok(!/['"]\/play(?:\.html)?['"]/.test(sw.split('const CORE =')[1]?.split('];')[0] || ''), 'protected play HTML is not precached');
ok(/event\.request\.mode === 'navigate'/.test(sw) && /fetch\(event\.request\)/.test(sw), 'PWA navigation still reaches network/edge access gate');

['/play','/diagnostics','/analysis','/feedback'].forEach(route => {
  ok(edgeGate.includes(`"${route}"`) || edgeGate.includes(`'${route}'`), `edge gate protects ${route}`);
  ok(config.includes(`from = "${route}"`), `Netlify route configured: ${route}`);
});

// Telemetry and analysis compatibility.
ok(/decisionMs/.test(game) && /elapsedMs/.test(game), 'game telemetry emits decision and elapsed timing fields');
ok(/pointValue/.test(game), 'game telemetry emits displayed point value');
ok(/sessionConfig/.test(game) && /passMode/.test(game), 'game export envelope carries experimental session configuration');
ok(/row\.decisionMs/.test(analysisJs) && /row\.choiceMs/.test(analysisJs), 'analysis consumes current choice-time fields');
ok(/elapsedMs - choiceMs/.test(analysisJs), 'analysis derives guess time from elapsed and choice timing');
ok(/row\.pointValue/.test(analysisJs), 'analysis consumes displayed point value');
ok(/Median choice/.test(analysisJs), 'analysis surfaces median choice time');
ok(/decision-tension/i.test(analysis), 'analysis UI frames prompt triage around decision tension');
ok(/files are not uploaded/i.test(analysis), 'analysis page explicitly states local-only file processing');

// Forms and privacy.
ok(/name="playtest-session-feedback"/.test(feedback) && /data-netlify="true"/.test(feedback), 'structured feedback form remains Netlify-discoverable');
ok(/name="session_validity"/.test(feedback), 'feedback captures session validity');
ok(/name="points_influenced_choice"/.test(feedback), 'feedback captures point-value influence');
ok(/name="decision_tension"/.test(feedback), 'feedback captures perceived decision tension');
ok(/camera or microphone/i.test(playtest), 'playtest page explains prototype permission/privacy behavior');

// Historical material must remain isolated rather than silently rewritten into current truth.
const archive = read('archive.html');
ok(/Not current product truth/.test(archive), 'archive explicitly warns that historical material is non-authoritative');
ok(/\/legacy\/v1/.test(config) && /\/legacy\/v2/.test(config) && /\/legacy\/v3/.test(config), 'legacy creative-direction routes remain preserved');
ok(/X-Robots-Tag = "noindex, nofollow"/.test(config), 'historical/development surfaces remain search-isolated');

// Prompt candidate data integrity.
const csvText = read('content/prompt-candidates-v0.6.csv').trim();
const lines = csvText.split(/\r?\n/);
const expectedHeader = [
  'id','prompt','category','hum_points','sound_points','draw_points','mime_points',
  'hum_fit','sound_fit','draw_fit','mime_fit','representability','clear_target',
  'audience_fit','rights_safety','accidental_giveaway','status','notes'
];
const header = parseCsvLine(lines.shift());
ok(header.join('|') === expectedHeader.join('|'), 'prompt CSV header matches documented evidence schema');
ok(lines.length === 150, 'prompt pool contains exactly 150 candidate rows');

const index = Object.fromEntries(expectedHeader.map((name, i) => [name, i]));
const ids = new Set();
const prompts = new Set();
const validStatuses = new Set(['PROPOSED_CORE','HOLD_AUDIO_RISK']);
const validFits = new Set(['H','M','L']);
let badRows = 0;
for (const [lineIndex, line] of lines.entries()) {
  const rowNumber = lineIndex + 2;
  const cols = parseCsvLine(line);
  if (cols.length !== expectedHeader.length) {
    console.error(`FAIL  candidate row ${rowNumber} has ${cols.length} columns`);
    badRows += 1;
    continue;
  }

  const id = cols[index.id].trim();
  const prompt = cols[index.prompt].trim();
  const status = cols[index.status].trim();

  if (!/^C\d{3}$/.test(id) || !prompt || ids.has(id) || prompts.has(prompt)) badRows += 1;
  ids.add(id);
  prompts.add(prompt);

  for (const field of ['hum_points','sound_points','draw_points','mime_points']) {
    const n = Number(cols[index[field]]);
    if (!Number.isInteger(n) || n < 1 || n > 3) badRows += 1;
  }
  for (const field of ['hum_fit','sound_fit','draw_fit','mime_fit']) {
    if (!validFits.has(cols[index[field]])) badRows += 1;
  }
  if (!validStatuses.has(status)) badRows += 1;
  if (!cols[index.notes].trim()) badRows += 1;
}
ok(badRows === 0, 'candidate prompt rows pass ID, uniqueness, points, fit, status, and notes validation');

const appVersionMatch = game.match(/const APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
warn(Boolean(appVersionMatch && /^0\.6\./.test(appVersionMatch[1])), `telemetry app version identifies v0.6 (${appVersionMatch?.[1] || 'not found'})`);

console.log(`\nVerification complete: ${failures} failure(s), ${warnings} warning(s).`);
if (failures > 0) process.exit(1);
