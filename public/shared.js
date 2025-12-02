// shared.js
const API = '';

function getToken(){ return localStorage.getItem('token') || ''; }
function saveToken(t){ localStorage.setItem('token', t); }
function logout(){ localStorage.removeItem('token'); location.href = '/'; }

async function api(path, opts={}){
  const headers = Object.assign({'Content-Type':'application/json'}, (opts.headers||{}));
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(API + path, Object.assign({}, opts, { headers }));
  try { return await res.json(); } catch { return { error: 'Network/parse error' }; }
}

async function protect(role){
  const t = getToken();
  if (!t) return location.href = '/';
  const me = await api('/me');
  if (me.error) return location.href = '/';
  if (role && me.role !== role) return location.href = '/';
}

// calendar rendering (month grid with leading/trailing days)
function renderCalendar(model, host){
  const today = dayStr(new Date());
  const holidays = new Set(model.holidays || []);

  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const first = new Date(year, month, 1);
  const last  = new Date(year, month+1, 0);

  const startWeekday = (first.getDay()+6)%7; // Monday=0
  const totalDays = last.getDate();
  const cells = [];

  for (let i=0;i<startWeekday;i++) cells.push({ date:null });
  for (let d=1; d<=totalDays; d++){
    const dt = new Date(year, month, d);
    const key = dayStr(dt);
    const dayItems = [];

    (model.items||[]).forEach(it=>{
      if (it.type==='leave'){
        if (key >= it.from && key <= it.to) {
          dayItems.push({ color: it.status==='approved'?'green':'yellow', label: it.surname });
        }
      } else if (it.type==='repo'){
        if (key === it.date) dayItems.push({ color: 'pink', label: it.surname });
      }
    });

    const isHoliday = holidays.has(key);
    cells.push({ date:key, day:d, holiday:isHoliday, items:dayItems });
  }
  while (cells.length % 7 !== 0) cells.push({ date:null });

  host.innerHTML = `
    <div class="weekhdr">
      <div>Δευ</div><div>Τρι</div><div>Τετ</div><div>Πεμ</div><div>Παρ</div><div>Σαβ</div><div>Κυρ</div>
    </div>
    <div class="grid7">
      ${cells.map(c=>{
        if(!c.date) return `<div class="day empty"></div>`;
        const hClass = c.holiday ? ' holiday' : '';
        return `<div class="day${hClass}">
          <div class="dnum ${c.date===today?'today':''}">${c.day}</div>
          <div class="tags">
            ${c.items.map(i=>`<span class="tag ${i.color}">${i.label}</span>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}

function renderMine(model, host){
  const meSurname = (model.me?.last_name)||'';
  const my = (model.items||[]).filter(x => x.surname===meSurname);
  host.innerHTML = my.map(it=>{
    if (it.type==='leave'){
      return `<div class="row between">
        <div>Άδεια: ${it.from} → ${it.to} — <b>${it.surname}</b> (${it.status})</div>
        ${it.status==='pending'?`<button class="btn danger" data-type="leave" data-id="${it.id}">Ακύρωση</button>`:''}
      </div>`;
    } else {
      return `<div class="row between">
        <div>Ρεπό: ${it.date} — <b>${it.surname}</b> (${it.status})</div>
        ${it.status==='pending'?`<button class="btn danger" data-type="repo" data-id="${it.id}">Ακύρωση</button>`:''}
      </div>`;
    }
  }).join('') || '<div class="muted">Καμία υποβολή.</div>';

  host.querySelectorAll('button[data-type]').forEach(b=>{
    b.addEventListener('click', async ()=>{
      const id = b.dataset.id, type = b.dataset.type;
      const url = type==='leave'? `/leaves/${id}` : `/repos/${id}`;
      const r = await api(url, { method:'DELETE' });
      if (r.error) return alert(r.error);
      location.reload();
    });
  });
}

function dayStr(d){
  const dt = new Date(d);
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const day = String(dt.getDate()).padStart(2,'0');
  return `${dt.getFullYear()}-${m}-${day}`;
}
