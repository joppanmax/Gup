/* glowup components — exported to window at end */
const { useState, useRef, useEffect } = React;

function ProgressRing({ size = 88, stroke = 8, pct = 0, track, color }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)' }}
      />
    </svg>
  );
}

function GoalWash({ tint }) {
  return (
    <div
      className="tile-wash"
      style={{ background: `linear-gradient(155deg, var(${tint[0]}), var(${tint[1]}))` }}
    ></div>
  );
}

/* merge a goal's default task lists with any per-month user edits in state */
function resolveTasks(goal, gstate) {
  const out = {};
  const base = goal.tasks || {};
  for (const k in base) out[k] = base[k];
  const ov = (gstate && gstate.tasks) || {};
  for (const k in ov) out[k] = ov[k];
  return out;
}

/* count done/total across every month for a tasks map */
function goalProgress(tasksMap, checks) {
  let total = 0, done = 0;
  for (const k in tasksMap) {
    const arr = tasksMap[k] || [];
    total += arr.length;
    const c = (checks && checks[k]) || [];
    done += arr.reduce((a, _, i) => a + (c[i] ? 1 : 0), 0);
  }
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function BoardTile({ goal, gstate, onOpen, monthKey }) {
  const checks = gstate.checks || {};
  const { total, done, pct } = goalProgress(resolveTasks(goal, gstate), checks);
  const bloom = total ? done / total : 0;
  const bloomed = total > 0 && done === total;
  const slotId = 'slot-' + goal.id;
  const subs = gstate.subs || {};
  const sub = (subs[monthKey] !== undefined && subs[monthKey] !== null) ? subs[monthKey] : goal.sub;

  return (
    <div className="tile" style={{ '--bloom': bloom }}>
      <div
        className="tile-photo"
        style={{ height: goal.photoH, cursor: 'pointer' }}
        onClickCapture={(e) => {
          const slot = e.currentTarget.querySelector('image-slot');
          if (slot && slot.hasAttribute('data-filled')) { e.stopPropagation(); onOpen(); }
        }}
      >
        <image-slot
          id={slotId}
          shape="rect"
          fit="cover"
          class="ph-tint"
          src={goal.img || undefined}
          placeholder={'drop a ' + goal.short + ' photo  \u2726'}
          style={{ width: '100%', height: '100%' }}
        ></image-slot>
        <GoalWash tint={goal.tint} />
        <div className="tile-sparkles">
          <span>&#10022;</span><span>&#10023;</span><span>&#10022;</span><span>&#10023;</span>
        </div>
        <div className="tile-pct-badge">{pct}%</div>
        {bloomed && <div className="tile-ribbon">in full bloom &#10047;</div>}
      </div>
      <div className="tile-body" onClick={onOpen} role="button" tabIndex={0}
           onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}>
        <div className="tile-head">
          <div className="tile-icon">{goal.icon}</div>
          <div className="tile-title">{goal.title}</div>
        </div>
        <p className="tile-sub">{sub}</p>
        <div className="tile-bar"><div className="tile-bar-fill" style={{ width: pct + '%' }}></div></div>
        <div className="tile-meta">
          <span>{done}/{total} tasks</span>
          <span className="view">open &#10022;</span>
        </div>
      </div>
    </div>
  );
}

function CheckRow({ text, checked, onToggle }) {
  const [bursts, setBursts] = useState([]);
  const bid = useRef(0);

  function handle() {
    if (!checked) {
      const id = bid.current++;
      const parts = Array.from({ length: 7 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 7 + Math.random() * 0.5;
        const d = 20 + Math.random() * 16;
        return { x: Math.cos(a) * d, y: Math.sin(a) * d };
      });
      setBursts((b) => [...b, { id, parts }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 700);
    }
    onToggle(!checked);
  }

  return (
    <div className={'check-row' + (checked ? ' done' : '')} onClick={handle}>
      <div className="check-box">
        <svg viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6" /></svg>
      </div>
      <div className="ctext">{text}</div>
      {bursts.map((b) => (
        <div className="burst" key={b.id}>
          {b.parts.map((p, i) => (
            <i key={i} style={{ '--bx': p.x + 'px', '--by': p.y + 'px', animationDelay: (i * 8) + 'ms' }}></i>
          ))}
        </div>
      ))}
    </div>
  );
}

function DetailOverlay({ goal, gstate, months, currentIndex, onToggleTask, onNote, onClose, onAddTask, onEditTask, onDeleteTask, onEditSub }) {
  const [sel, setSel] = useState(currentIndex);
  const [editing, setEditing] = useState(false);
  const [editingSub, setEditingSub] = useState(false);

  useEffect(() => {
    function esc(e) { if (e.key === 'Escape') { if (editing) setEditing(false); else onClose(); } }
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose, editing]);

  const checks = gstate.checks || {};
  const allTasks = resolveTasks(goal, gstate);
  const overall = goalProgress(allTasks, checks);

  const month = months[sel];
  const tasks = allTasks[month.key] || [];
  const subs = gstate.subs || {};
  const sub = (subs[month.key] !== undefined && subs[month.key] !== null) ? subs[month.key] : goal.sub;
  const mChecks = checks[month.key] || [];
  const mDone = tasks.reduce((a, _, i) => a + (mChecks[i] ? 1 : 0), 0);
  const isNow = sel === currentIndex;

  return (
    <div className="overlay-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet">
        <button className="sheet-close" onClick={onClose} aria-label="close">&#10005;</button>
        <div className="sheet-banner">
          <div className="wash" style={{ background: `linear-gradient(135deg, var(${goal.tint[0]}), var(${goal.tint[1]}))` }}></div>
          <span className="spk" style={{ top: '20%', left: '70%', fontSize: 16 }}>&#10022;</span>
          <span className="spk" style={{ top: '55%', left: '86%', fontSize: 12, animationDelay: '1s' }}>&#10023;</span>
          <span className="spk" style={{ top: '30%', left: '40%', fontSize: 11, animationDelay: '2s' }}>&#10022;</span>
          <div className="head">
            <div className="ic">{goal.icon}</div>
            <h2>{goal.title}</h2>
          </div>
        </div>
        <div className="sheet-body">
          <div className="sub-row">
            {editingSub ? (
              <textarea
                key={month.key}
                className="sub-input"
                rows={2}
                autoFocus
                defaultValue={sub}
                placeholder={'description for ' + month.label + '\u2026'}
                onBlur={(e) => { onEditSub(goal.id, month.key, e.target.value); setEditingSub(false); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEditSub(goal.id, month.key, e.target.value); setEditingSub(false); }
                  if (e.key === 'Escape') { e.preventDefault(); setEditingSub(false); }
                }}
              ></textarea>
            ) : (
              <p className="sheet-sub">{sub}</p>
            )}
            {!editingSub && (
              <button className="sub-edit-btn" aria-label="edit this month's description" title="edit this month's description"
                onClick={() => setEditingSub(true)}>
                <svg viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path></svg>
              </button>
            )}
          </div>

          <div className="sheet-progress">
            <div className="ring-wrap">
              <ProgressRing size={64} stroke={7} pct={overall.pct}
                track="var(--blush-soft)" color="var(--rose-deep)" />
              <div className="pn">{overall.pct}%</div>
            </div>
            <div className="copy">
              <div className="big">your year so far</div>
              <div className="small">{overall.done} of {overall.total} tasks across all months</div>
            </div>
          </div>

          {/* month navigator */}
          <div className="month-nav">
            <button className="month-arrow" disabled={sel === 0}
              onClick={() => setSel((s) => Math.max(0, s - 1))} aria-label="previous month">&#8249;</button>
            <div className="month-title">
              {month.label}
              {isNow && <span className="month-now">this month</span>}
            </div>
            <button className="month-arrow" disabled={sel === months.length - 1}
              onClick={() => setSel((s) => Math.min(months.length - 1, s + 1))} aria-label="next month">&#8250;</button>
          </div>

          <div className="month-strip">
            {months.map((m, i) => (
              <button
                key={m.key}
                className={'m-pill' + (i === sel ? ' active' : '') + (i === currentIndex ? ' now' : '')}
                onClick={() => setSel(i)}
                title={m.label}
              >{m.short}<span className="m-pill-yr">{m.yr}</span></button>
            ))}
          </div>

          <div className="month-head">
            <div className="checklist-label">tasks &middot; {month.label}</div>
            <div className="month-head-right">
              {!editing && tasks.length > 0 && <div className="month-count">{mDone}/{tasks.length} done</div>}
              <button className={'edit-toggle' + (editing ? ' on' : '')}
                onClick={() => setEditing((v) => !v)}>{editing ? 'done' : 'edit'}</button>
            </div>
          </div>

          {editing ? (
            <div className="edit-list">
              <div className="edit-hint">Edit, remove, or add tasks for {month.label}.</div>
              {tasks.map((m, i) => (
                <div className="edit-row" key={month.key + '_e_' + i}>
                  <input
                    className="task-input"
                    value={m}
                    placeholder="task description&hellip;"
                    onChange={(e) => onEditTask(goal.id, month.key, i, e.target.value)}
                  />
                  <button className="del-task" aria-label="delete task"
                    onClick={() => onDeleteTask(goal.id, month.key, i)}>&#10005;</button>
                </div>
              ))}
              <button className="add-task" onClick={() => onAddTask(goal.id, month.key)}>+ add a task</button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-tasks">
              <div className="et-spark">&#10047;</div>
              <div className="et-title">No tasks for {month.label} yet</div>
              <div className="et-sub">Tap &ldquo;edit&rdquo; above to add this month&rsquo;s tasks.</div>
            </div>
          ) : (
            tasks.map((m, i) => (
              <CheckRow key={month.key + '_' + i} text={m} checked={!!mChecks[i]}
                onToggle={(v) => onToggleTask(goal.id, month.key, i, v)} />
            ))
          )}

          <textarea
            className="notes"
            placeholder={'notes, wins, reflections\u2026'}
            defaultValue={gstate.notes || ''}
            onChange={(e) => onNote(goal.id, e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProgressRing, BoardTile, CheckRow, DetailOverlay, goalProgress, resolveTasks });
