/**
 * app.js — UI Controller (Single-Page Results)
 * Calls Flask + Gemini API, falls back to offline analyzer.
 */

const API_BASE = "http://localhost:5000";

/* ── DOM ──────────────────────────────────────────────────── */
const form        = document.getElementById('life-form');
const nameInput   = document.getElementById('user-name');
const dobInput    = document.getElementById('user-dob');
const nameError   = document.getElementById('name-error');
const dobError    = document.getElementById('dob-error');
const generateBtn = document.getElementById('generate-btn');
const resetBtn    = document.getElementById('reset-btn');
const downloadBtn = document.getElementById('download-btn');

const inputPage   = document.getElementById('input-page');
const loadingPage = document.getElementById('loading-page');
const resultsPage = document.getElementById('results-page');

let currentReport = null;

/* ── Init ─────────────────────────────────────────────────── */
document.getElementById('current-year').textContent = new Date().getFullYear();
dobInput.max = new Date().toISOString().split('T')[0];
const minD = new Date(); minD.setFullYear(minD.getFullYear() - 110);
dobInput.min = minD.toISOString().split('T')[0];

/* ── Validation ──────────────────────────────────────────── */
function validate() {
  let ok = true;
  nameError.textContent = ''; dobError.textContent = '';
  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    nameError.textContent = 'Please enter a valid name.'; ok = false;
  }
  if (!dobInput.value) {
    dobError.textContent = 'Please select your date of birth.'; ok = false;
  } else {
    const age = LifeAnalyzer.calcAge(dobInput.value);
    if (age < 5 || age > 110) { dobError.textContent = 'Enter a realistic date.'; ok = false; }
  }
  return ok;
}

/* ── Loading Animation ────────────────────────────────────── */
function runLoader() {
  return new Promise(resolve => {
    const ids = ['step-1','step-2','step-3','step-4'];
    ids.forEach(id => { const el = document.getElementById(id); el.classList.remove('active','done'); });
    document.getElementById(ids[0]).classList.add('active');
    let i = 0;
    const iv = setInterval(() => {
      document.getElementById(ids[i]).classList.replace('active','done');
      i++;
      if (i < ids.length) document.getElementById(ids[i]).classList.add('active');
      else { clearInterval(iv); setTimeout(resolve, 350); }
    }, 600);
  });
}

/* ── Page Switching ──────────────────────────────────────── */
function show(page) {
  [inputPage, loadingPage, resultsPage].forEach(p => p.classList.add('hidden'));
  page.classList.remove('hidden');
}

/* ── API Call ─────────────────────────────────────────────── */
async function fetchAPI(name, dob) {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, dob }),
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || 'Server error'); }
  return res.json();
}

/* ── Normalize API → internal format ─────────────────────── */
function normalize(api) {
  const { meta, insights: ins } = api;
  return {
    meta: { name: meta.name, dob: meta.dob, age: meta.age, initials: meta.initials, stage: meta.life_stage, emoji: emoji(meta.age) },
    core:    ins.core_nature    || [],
    family:  ins.family         || {},
    love:    ins.love           || {},
    comm:    ins.communication  || [],
    careerTL:ins.career_timeline|| {},
    careerN: ins.career_nature  || [],
    summary: ins.summary        || '',
    source:  'gemini',
  };
}

function emoji(age) {
  if (age<13)return'🧒'; if (age<18)return'🎒'; if (age<23)return'📚';
  if (age<28)return'🚀'; if (age<35)return'📈'; if (age<45)return'⚖️';
  if (age<55)return'🏆'; if (age<65)return'🌿'; return'🌅';
}

/* ── Helpers ──────────────────────────────────────────────── */
const dots = ['d-v','d-c','d-p','d-g','d-a'];

function makeBulletList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = '';
  items.forEach((text, i) => {
    const li  = document.createElement('li');
    const dot = document.createElement('span');
    dot.className = `dot ${dots[i % dots.length]}`; dot.textContent = '✦';
    const sp = document.createElement('span'); sp.textContent = text;
    li.append(dot, sp); ul.appendChild(li);
  });
}

function makeMTRow(labelClass, labelText, text) {
  const row = document.createElement('div'); row.className = 'mt-row';
  const lbl = document.createElement('span'); lbl.className = `mt-label ${labelClass}`; lbl.textContent = labelText;
  const tx  = document.createElement('span'); tx.className  = 'mt-text'; tx.textContent = text;
  row.append(lbl, tx); return row;
}

function makeCTBlock(labelClass, labelText, text) {
  const b = document.createElement('div'); b.className = 'ct-block';
  const l = document.createElement('div'); l.className = `ct-label ${labelClass}`; l.textContent = labelText;
  const t = document.createElement('div'); t.className = 'ct-text'; t.textContent = text;
  b.append(l, t); return b;
}

/* ── Render ───────────────────────────────────────────────── */
function render(r) {
  const dob = new Date(r.meta.dob + 'T00:00:00').toLocaleDateString('en-IN',
    { year:'numeric', month:'short', day:'numeric' });

  // Profile strip
  document.getElementById('result-avatar').textContent = r.meta.initials;
  document.getElementById('result-name').textContent   = `📘 Life Overview — ${r.meta.name}`;
  const chips = document.getElementById('profile-chips');
  chips.innerHTML = '';
  [
    ['Age ' + r.meta.age,             ''],
    [r.meta.emoji + ' ' + r.meta.stage,''],
    ['Born ' + dob,                   'amber'],
    [r.source === 'gemini' ? '✦ Gemini AI' : '⚡ Offline', r.source === 'gemini' ? 'green' : 'amber'],
  ].forEach(([text, cls]) => {
    const c = document.createElement('span');
    c.className = `chip ${cls}`; c.textContent = text; chips.appendChild(c);
  });

  // 1. Core Nature
  makeBulletList('core-list', r.core);

  // 2. Family
  const fam = document.getElementById('family-timeline'); fam.innerHTML = '';
  fam.append(
    makeMTRow('mt-past',    'Past',    r.family.past    || ''),
    makeMTRow('mt-present', 'Present', r.family.present || ''),
    makeMTRow('mt-future',  'Future',  r.family.future  || ''),
  );

  // 3. Love
  const love = document.getElementById('love-content'); love.innerHTML = '';
  const typeDiv = document.createElement('div'); typeDiv.className = 'love-type';
  const lbl = document.createElement('div'); lbl.className = 'love-label'; lbl.textContent = 'Relationship Tendency';
  typeDiv.append(lbl, document.createTextNode(r.love.type || ''));
  const loveRows = document.createElement('div'); loveRows.className = 'mini-timeline';
  loveRows.append(
    makeMTRow('mt-near', '1–2 yr', r.love.near_future || ''),
    makeMTRow('mt-mid',  '3–5 yr', r.love.mid_future  || ''),
    makeMTRow('mt-long', '5+ yr',  r.love.long_term   || ''),
  );
  love.append(typeDiv, loveRows);

  // 4. Communication
  makeBulletList('comm-list', r.comm);

  // 5. Career Timeline
  const ct = document.getElementById('career-timeline-row'); ct.innerHTML = '';
  const tl = r.careerTL;
  [
    ['mt-past',    'Past',    tl.past     || ''],
    ['mt-present', 'Now',     tl.present  || ''],
    ['mt-near',    '1–2 yr',  tl.near_term|| ''],
    ['mt-mid',     '3–5 yr',  tl.mid_term || ''],
    ['mt-long',    '5+ yr',   tl.long_term|| ''],
  ].forEach(([cls, label, text]) => ct.appendChild(makeCTBlock(cls, label, text)));

  // 6. Career Nature
  makeBulletList('career-nature-list', r.careerN);

  // 7. Summary
  document.getElementById('summary-text').textContent = r.summary;
}

/* ── Reset ───────────────────────────────────────────────── */
function reset() {
  currentReport = null; form.reset();
  nameError.textContent = ''; dobError.textContent = '';
  show(inputPage);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Download ─────────────────────────────────────────────── */
function download(r) {
  const dob = new Date(r.meta.dob + 'T00:00:00').toLocaleDateString('en-IN',
    { year:'numeric', month:'long', day:'numeric' });
  const L = '─'.repeat(54);
  const lines = [
    `LIFE OVERVIEW — ${r.meta.name.toUpperCase()}`,
    `Age: ${r.meta.age} | Stage: ${r.meta.stage} | Born: ${dob}`,
    `Source: ${r.source === 'gemini' ? 'Gemini AI' : 'Offline Mode'}`,
    '', L, 'CORE NATURE', L,
    ...r.core.map((t,i)=>`${i+1}. ${t}`),
    '', L, 'FAMILY LIFE', L,
    `Past:    ${r.family.past}`,
    `Present: ${r.family.present}`,
    `Future:  ${r.family.future}`,
    '', L, 'LOVE & RELATIONSHIPS', L,
    `Type: ${r.love.type}`,
    `1-2yr: ${r.love.near_future}`,
    `3-5yr: ${r.love.mid_future}`,
    `5+yr:  ${r.love.long_term}`,
    '', L, 'COMMUNICATION', L,
    ...r.comm.map((t,i)=>`${i+1}. ${t}`),
    '', L, 'CAREER TIMELINE', L,
    `Past:    ${r.careerTL.past}`,
    `Now:     ${r.careerTL.present}`,
    `1-2yr:   ${r.careerTL.near_term}`,
    `3-5yr:   ${r.careerTL.mid_term}`,
    `5+yr:    ${r.careerTL.long_term}`,
    '', L, 'CAREER NATURE', L,
    ...r.careerN.map((t,i)=>`${i+1}. ${t}`),
    '', L, 'SUMMARY', L, r.summary,
    '', L,
    '"Growth is gradual and influenced by choices, not fixed outcomes."',
    L,
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `LifeInsight_${r.meta.name.replace(/\s+/g,'_')}.txt`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/* ── Form Submit ─────────────────────────────────────────── */
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validate()) return;
  const name = nameInput.value.trim(), dob = dobInput.value;
  generateBtn.disabled = true;
  show(loadingPage);

  const [apiResult] = await Promise.allSettled([fetchAPI(name, dob), runLoader()]);

  if (apiResult.status === 'fulfilled') {
    currentReport = normalize(apiResult.value);
  } else {
    console.warn('Offline fallback:', apiResult.reason?.message);
    const fb = LifeAnalyzer.analyze(name, dob);
    currentReport = {
      meta:     { name: fb.meta.name, dob: fb.meta.dob, age: fb.meta.age, initials: fb.meta.initials, stage: fb.meta.stage.label, emoji: fb.meta.stage.emoji },
      core:     fb.coreNature,
      family:   { past: fb.familyLife.past, present: fb.familyLife.present, future: fb.familyLife.future },
      love:     { type: fb.loveLife.type, near_future: fb.loveLife.near, mid_future: fb.loveLife.mid, long_term: fb.loveLife.longTerm },
      comm:     fb.communication,
      careerTL: { past: fb.careerTimeline.past, present: fb.careerTimeline.present, near_term: fb.careerTimeline.near, mid_term: fb.careerTimeline.mid, long_term: fb.careerTimeline.longTerm },
      careerN:  fb.careerNature,
      summary:  fb.summary,
      source:   'offline',
    };
  }

  render(currentReport);
  show(resultsPage);
  generateBtn.disabled = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

resetBtn.addEventListener('click', reset);
downloadBtn.addEventListener('click', () => { if (currentReport) download(currentReport); });
