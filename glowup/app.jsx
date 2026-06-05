/* glowup app */
const { useState: useStateA, useEffect: useEffectA, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "Fairycore",
  "titleFont": "Playfair Display",
  "softness": 18,
  "decor": true
}/*EDITMODE-END*/;

const PALETTES = {
  "Fairycore": {
    "--cream": "#fdfcf5", "--paper": "#fffef9", "--ink": "#64614a", "--ink-soft": "#9a9577",
    "--rose": "#e7a3b0", "--rose-deep": "#d57f96", "--blush": "#f2c8cf", "--blush-soft": "#f8f3df",
    "--butter": "#e9da8c", "--sage": "#b6cd96", "--sage-deep": "#95b372", "--lilac": "#aab0d8"
  },
  "Peach Glow": {
    "--cream": "#fdf6f1", "--paper": "#fffdfb", "--ink": "#7a5448", "--ink-soft": "#b0897a",
    "--rose": "#f0a98c", "--rose-deep": "#e08a6a", "--blush": "#f8d3c0", "--blush-soft": "#fce9df",
    "--butter": "#f2d79c", "--sage": "#cdcf9f", "--sage-deep": "#b8bb86", "--lilac": "#e0b6c4"
  },
  "Sage Garden": {
    "--cream": "#f6f8f1", "--paper": "#fffefb", "--ink": "#52614c", "--ink-soft": "#8a9a83",
    "--rose": "#cdb6c4", "--rose-deep": "#b495a8", "--blush": "#dfe7cf", "--blush-soft": "#eef2e6",
    "--butter": "#e6e2a0", "--sage": "#a9c594", "--sage-deep": "#8fb178", "--lilac": "#bcc6e0"
  },
  "Lilac Dream": {
    "--cream": "#f8f5fb", "--paper": "#fffdff", "--ink": "#5d5172", "--ink-soft": "#998fb0",
    "--rose": "#c9a9d8", "--rose-deep": "#b48ec9", "--blush": "#e4d3ee", "--blush-soft": "#f1e8f6",
    "--butter": "#e8dca8", "--sage": "#bcd0c4", "--sage-deep": "#a3bdad", "--lilac": "#b3a8e0"
  }
};

const FONTS = {
  "Playfair Display": "'Playfair Display', serif",
  "Cormorant": "'Cormorant Garamond', serif",
  "EB Garamond": "'EB Garamond', serif"
};

const GOALS = [
  { id: 'engineering', icon: '\uD83C\uDFDB\uFE0F', title: 'engineering prep', short: 'study',
    sub: 'UAS or Netherlands admission \u2014 all requirements met by June 2027',
    tint: ['--sage', '--butter'], photoH: 230,
    milestones: [
      'Research UAS & Dutch university requirements',
      'Shortlist 3\u20135 programmes with entry criteria',
      'Gather academic transcripts & documents',
      'Appear for any required entrance exams',
      'Write statement of purpose',
      'Submit applications before deadline',
    ] },
  { id: 'german', icon: '\uD83C\uDDE9\uD83C\uDDEA', title: 'learning german', short: 'language',
    sub: 'A1 \u2192 A2 \u2192 B1 \u2192 B2 over 12 months (\u223C1\u20132 hrs/day)',
    tint: ['--butter', '--sage'], photoH: 190, img: 'glowup/deutsch-new.jpg',
    milestones: [
      'Complete A1 level (months 1\u20132)',
      'Complete A2 level (months 3\u20134)',
      'Pass official A2 exam',
      'Complete B1 level (months 5\u20138)',
      'Pass official B1 exam',
      'Complete B2 level (months 9\u201312)',
    ] },
  { id: 'sewing', icon: '\uD83E\uDDF5', title: 'sewing & dressmaking', short: 'sewing',
    sub: 'Sew 10 finished outfits \u2014 quality over speed',
    tint: ['--blush', '--butter'], photoH: 300,
    milestones: [
      'Outfits 1\u20132: master basic stitching',
      'Outfits 3\u20134: darts, zips & closures',
      'Outfits 5\u20136: structured garments',
      'Outfits 7\u20138: dresses with lining',
      'Outfit 9: a garment from own pattern',
      'Outfit 10: showpiece piece',
    ] },
  { id: 'doomscroll', icon: '\uD83C\uDF38', title: 'reducing doomscrolling', short: 'calm',
    sub: '9h screen time \u2192 2h over 12 months; replace with reading',
    tint: ['--sage', '--lilac'], photoH: 200, img: 'glowup/lotus.jpg',
    milestones: [
      'Log baseline & identify peak scroll times',
      'Set app limits \u2014 down to 6h (month 1\u20132)',
      'Replace evening scroll with 30 min reading',
      'Screen time at 4h (month 4\u20136)',
      'Read 1 book from TBR per month',
      'Screen time stabilised at 2h (month 10+)',
    ] },
  { id: 'brain', icon: '\uD83E\uDDE0', title: 'fixing focus', short: 'focus',
    sub: 'Rebuild deep focus through meditation & screen hygiene',
    tint: ['--sage-deep', '--sage'], photoH: 240,
    milestones: [
      'Start 5-min daily meditation habit',
      'Sit through 1 full movie without phone',
      'Extend meditation to 15 min',
      'Read for 45 min uninterrupted daily',
      'Complete a long project in one sitting',
      'Finish a novel in one week',
    ] },
  { id: 'training', icon: '\uD83E\uDD77', title: 'training & fitness', short: 'movement',
    sub: '0 \u2192 3 days/week training; 55kg \u2192 50kg at a healthy pace',
    tint: ['--rose', '--butter'], photoH: 200,
    milestones: [
      'Start 1 day/week \u2014 find what you enjoy',
      'Build to 2 days/week (month 2\u20133)',
      'Consistent 3 days/week (month 4+)',
      'First visible strength or stamina milestone',
      '52\u201353kg checkpoint (month 6)',
      'Reach and maintain 50kg',
    ] },
  { id: 'youtube', icon: '\uD83C\uDFA5', title: 'youtube channel', short: 'creative',
    sub: 'Post about creative life \u2014 art, DIY, music',
    tint: ['--butter', '--sage-deep'], photoH: 220,
    milestones: [
      'Define niche & channel aesthetic',
      'Set up filming & editing workflow',
      'Post first video (just ship it!)',
      '5 videos published',
      'First 100 subscribers',
      '12 videos by end of year',
    ] },
];

/* ---- monthly timeline: June 2026 → March 2027 ---- */
const MONTHS = [
  { key: '2026-06', label: 'June 2026', short: 'Jun', yr: "\u201926" },
  { key: '2026-07', label: 'July 2026', short: 'Jul', yr: "\u201926" },
  { key: '2026-08', label: 'August 2026', short: 'Aug', yr: "\u201926" },
  { key: '2026-09', label: 'September 2026', short: 'Sep', yr: "\u201926" },
  { key: '2026-10', label: 'October 2026', short: 'Oct', yr: "\u201926" },
  { key: '2026-11', label: 'November 2026', short: 'Nov', yr: "\u201926" },
  { key: '2026-12', label: 'December 2026', short: 'Dec', yr: "\u201926" },
  { key: '2027-01', label: 'January 2027', short: 'Jan', yr: "\u201927" },
  { key: '2027-02', label: 'February 2027', short: 'Feb', yr: "\u201927" },
  { key: '2027-03', label: 'March 2027', short: 'Mar', yr: "\u201927" },
];

function currentMonthIndex() {
  const d = new Date();
  const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  const i = MONTHS.findIndex((m) => m.key === k);
  if (i >= 0) return i;
  const cur = d.getFullYear() * 12 + d.getMonth();
  const start = 2026 * 12 + 5; // June 2026
  return cur < start ? 0 : MONTHS.length - 1;
}
const CURRENT_MONTH = currentMonthIndex();

/* ---- per-month task lists ----------------------------------------------
   Provide your monthly tasks here, e.g.
     RAW_TASKS.engineering['2026-06'] = ['Research universities', 'Shortlist 3'];
   Month keys run '2026-06' … '2027-03'. Any month left out shows an empty state.
   (For now each goal's original checkpoints sit in the opening month as a
   placeholder — they'll be replaced once you send the real month-by-month lists.)
------------------------------------------------------------------------- */
const RAW_TASKS = {};

GOALS.forEach((g) => {
  g.tasks = {};
  MONTHS.forEach((m, idx) => {
    const provided = RAW_TASKS[g.id] && RAW_TASKS[g.id][m.key];
    g.tasks[m.key] = provided ? provided.slice()
      : (idx === 0 ? (g.milestones || []).slice() : []);
  });
});

const KEY = 'glowup_v2';
const BOARD_ORDER = ['engineering', 'training', 'german', 'brain', 'sewing', 'doomscroll', 'youtube'];
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [state, setState] = useStateA(load);
  const [open, setOpen] = useStateA(null);
  const [ovMonth, setOvMonth] = useStateA(CURRENT_MONTH);

  useEffectA(() => { save(state); }, [state]);

  function gs(id) { return state[id] || { checks: {}, notes: '' }; }

  function toggleTask(id, monthKey, i, v) {
    setState((prev) => {
      const cur = prev[id] || { checks: {}, notes: '' };
      const checks = { ...(cur.checks || {}) };
      const arr = (checks[monthKey] || []).slice();
      arr[i] = v;
      checks[monthKey] = arr;
      return { ...prev, [id]: { ...cur, checks } };
    });
  }
  function note(id, val) {
    setState((prev) => ({ ...prev, [id]: { ...(prev[id] || { checks: {} }), notes: val } }));
  }

  function editSub(id, monthKey, val) {
    setState((prev) => {
      const cur = prev[id] || { checks: {} };
      return { ...prev, [id]: { ...cur, subs: { ...(cur.subs || {}), [monthKey]: val } } };
    });
  }

  /* edit the per-month task list (persists as an override in state) */
  function setGoalTasks(id, monthKey, updater) {
    setState((prev) => {
      const goal = GOALS.find((g) => g.id === id);
      const cur = prev[id] || { checks: {}, notes: '' };
      const curTasks = (cur.tasks && cur.tasks[monthKey] !== undefined)
        ? cur.tasks[monthKey] : (goal.tasks[monthKey] || []);
      const curChecks = (cur.checks && cur.checks[monthKey]) || [];
      const r = updater(curTasks.slice(), curChecks.slice());
      return {
        ...prev,
        [id]: {
          ...cur,
          tasks: { ...(cur.tasks || {}), [monthKey]: r.tasks },
          checks: { ...(cur.checks || {}), [monthKey]: r.checks },
        },
      };
    });
  }
  function addTask(id, mk) { setGoalTasks(id, mk, (t, c) => { t.push(''); return { tasks: t, checks: c }; }); }
  function editTask(id, mk, i, text) { setGoalTasks(id, mk, (t, c) => { t[i] = text; return { tasks: t, checks: c }; }); }
  function deleteTask(id, mk, i) { setGoalTasks(id, mk, (t, c) => { t.splice(i, 1); c.splice(i, 1); return { tasks: t, checks: c }; }); }
  function resetAll() {
    if (window.confirm('Reset all progress on your vision board? This cannot be undone.')) {
      setState({});
    }
  }

  /* stats for the selected overview month */
  const stats = useMemo(() => {
    const mk = MONTHS[ovMonth].key;
    let total = 0, done = 0, bloomed = 0, started = 0;
    GOALS.forEach((g) => {
      const arr = resolveTasks(g, gs(g.id))[mk] || [];
      const c = (gs(g.id).checks || {})[mk] || [];
      const d = arr.reduce((a, _, i) => a + (c[i] ? 1 : 0), 0);
      total += arr.length; done += d;
      if (arr.length > 0 && d === arr.length) bloomed++;
      if (d > 0) started++;
    });
    return { total, done, bloomed, started, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [state, ovMonth]);

  const pal = PALETTES[t.palette] || PALETTES["Fairycore"];
  const appVars = { ...pal, '--radius': t.softness + 'px', '--title-font': FONTS[t.titleFont] || FONTS["Playfair Display"] };
  const openGoal = open ? GOALS.find((g) => g.id === open) : null;

  return (
    <div className={'app' + (t.decor ? '' : ' decor-off')} style={appVars}>
      <div className="decor">
        <div className="orb a"></div><div className="orb b"></div><div className="orb c"></div>
        <span className="twinkle" style={{ top: '14%', left: '12%' }}>&#10022;</span>
        <span className="twinkle" style={{ top: '22%', left: '84%', animationDelay: '2s' }}>&#10023;</span>
        <span className="twinkle" style={{ top: '64%', left: '8%', animationDelay: '3.4s' }}>&#10022;</span>
        <span className="twinkle" style={{ top: '78%', left: '90%', animationDelay: '1.2s' }}>&#10023;</span>
        <span className="twinkle" style={{ top: '46%', left: '52%', animationDelay: '4.2s' }}>&#10022;</span>
      </div>

      <div className="shell">
        <header className="masthead">
          <h1><span className="star">&#10022;</span>Glow Up Era<span className="star">&#10022;</span></h1>
          <div className="dates">June 2026 &nbsp;&rarr;&nbsp; March 2027 &middot; a vision board that blooms with you</div>
        </header>

        <div className="overview">
          <div className="ov-monthnav">
            <button className="ov-arrow" disabled={ovMonth === 0}
              onClick={() => setOvMonth((m) => Math.max(0, m - 1))} aria-label="previous month">&#8249;</button>
            <div className="ov-month-label">
              {MONTHS[ovMonth].label}
              {ovMonth === CURRENT_MONTH && <span className="month-now">this month</span>}
            </div>
            <button className="ov-arrow" disabled={ovMonth === MONTHS.length - 1}
              onClick={() => setOvMonth((m) => Math.min(MONTHS.length - 1, m + 1))} aria-label="next month">&#8250;</button>
          </div>
          <div className="ov-main">
            <div className="ring-wrap">
              <ProgressRing size={104} stroke={10} pct={stats.pct}
                track="var(--blush-soft)" color="var(--rose-deep)" />
              <div className="ring-center">
                <div className="num">{stats.pct}%</div>
                <div className="lbl">in bloom</div>
              </div>
            </div>
            <div className="ov-stats">
              <div className="ov-stat"><div className="n">{stats.done}</div><div className="t">tasks done</div></div>
              <div className="ov-stat"><div className="n">{stats.total - stats.done}</div><div className="t">still to go</div></div>
              <div className="ov-stat"><div className="n">{stats.started}/{GOALS.length}</div><div className="t">dreams begun</div></div>
              <div className="ov-stat"><div className="n">{stats.bloomed}</div><div className="t">in full bloom</div></div>
            </div>
          </div>
        </div>

        <div className="board">
          {BOARD_ORDER.map((id) => GOALS.find((g) => g.id === id)).map((g) => (
            <BoardTile key={g.id} goal={g} gstate={gs(g.id)} monthKey={MONTHS[CURRENT_MONTH].key} onOpen={() => setOpen(g.id)} />
          ))}
        </div>

        <div className="board-footer">
          <button className="reset-btn" onClick={resetAll}>reset all progress</button>
        </div>
      </div>

      {openGoal && (
        <DetailOverlay
          goal={openGoal}
          gstate={gs(openGoal.id)}
          months={MONTHS}
          currentIndex={CURRENT_MONTH}
          onToggleTask={toggleTask}
          onNote={note}
          onAddTask={addTask}
          onEditTask={editTask}
          onDeleteTask={deleteTask}
          onEditSub={editSub}
          onClose={() => setOpen(null)}
        />
      )}

      <TweaksPanel>
        <TweakSection label="Palette" />
        <TweakSelect label="Colour theme" value={t.palette}
          options={Object.keys(PALETTES)}
          onChange={(v) => setTweak('palette', v)} />
        <TweakSection label="Typography" />
        <TweakRadio label="Title font" value={t.titleFont}
          options={Object.keys(FONTS)}
          onChange={(v) => setTweak('titleFont', v)} />
        <TweakSection label="Feel" />
        <TweakSlider label="Corner softness" value={t.softness} min={6} max={30} step={1} unit="px"
          onChange={(v) => setTweak('softness', v)} />
        <TweakToggle label="Background sparkles" value={t.decor}
          onChange={(v) => setTweak('decor', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
