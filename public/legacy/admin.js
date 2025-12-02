// admin.js
(async function(){
  await protect('admin');

  const calendar   = document.getElementById('calendar');
  const pending    = document.getElementById('pending');
  const pendingCard = document.getElementById('pendingCard');
  const approved    = document.getElementById('approved');
  const approvedCard= document.getElementById('approvedCard');
  const btnUsers    = document.getElementById('btnUsers');
  const btnLogout   = document.getElementById('logout');

  btnUsers.addEventListener('click', ()=> location.href='/admin/users');
  btnLogout.addEventListener('click', logout);

  async function load(){
    const model = await api('/calendar');
    renderCalendar(model, calendar);

    const p = await api('/admin/pending');
    renderPending(pending, p, pendingCard);

    const a = await api('/admin/approved');
    renderApproved(approved, a, approvedCard);
  }
  await load();

  function renderPending(host, data, card){
    host.innerHTML = '';
    const { leaves=[], repos=[] } = data || {};
    const empty = (leaves.length===0 && repos.length===0);
    card.style.display = empty ? 'none' : 'block';
    if (empty) return;

    leaves.forEach(l=>{
      const row = document.createElement('div');
      row.className = 'row between';
      row.innerHTML = `
        <div class="row items">
          <div>Άδεια — <b>${l.owner_lastname || ''}</b></div>
          <input type="date" class="input" value="${l.from}" data-from="${l.id}"/>
          <span>→</span>
          <input type="date" class="input" value="${l.to}" data-to="${l.id}"/>
        </div>
        <div class="row">
          <button class="btn" data-save="${l.id}">Αποθήκευση</button>
          <button class="btn" data-approve="${l.id}" data-type="leave">Έγκριση</button>
          <button class="btn danger" data-reject="${l.id}" data-type="leave">Απόρριψη</button>
        </div>`;
      host.appendChild(row);
    });

    repos.forEach(r=>{
      const row = document.createElement('div');
      row.className = 'row between';
      row.innerHTML = `
        <div>Ρεπό: ${r.date} — <b>${r.owner_lastname || ''}</b></div>
        <div class="row">
          <button class="btn" data-approve="${r.id}" data-type="repo">Έγκριση</button>
          <button class="btn danger" data-reject="${r.id}" data-type="repo">Απόρριψη</button>
        </div>`;
      host.appendChild(row);
    });

    host.querySelectorAll('[data-save]').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const id = b.getAttribute('data-save');
        const from = host.querySelector(`input[data-from="${id}"]`)?.value;
        const to   = host.querySelector(`input[data-to="${id}"]`)?.value;
        const r = await api(`/admin/leaves/${id}`, { method:'PATCH', body: JSON.stringify({ from, to }) });
        if (r.error) { alert(r.error); return; }
        await load();
      });
    });
    host.querySelectorAll('[data-approve]').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const id = b.getAttribute('data-approve');
        const type = b.getAttribute('data-type');
        const url = type==='leave' ? `/admin/leaves/${id}/approve` : `/admin/repos/${id}/approve`;
        const r = await api(url, { method:'POST' });
        if (r.error) { alert(r.error); return; }
        await load();
      });
    });
    host.querySelectorAll('[data-reject]').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const id = b.getAttribute('data-reject');
        const type = b.getAttribute('data-type');
        const url = type==='leave' ? `/admin/leaves/${id}/reject` : `/admin/repos/${id}/reject`;
        const r = await api(url, { method:'POST' });
        if (r.error) { alert(r.error); return; }
        await load();
      });
    });
  }

  function renderApproved(host, data, card){
    host.innerHTML = '';
    const { leaves=[] } = data || {};
    const empty = (leaves.length===0);
    card.style.display = empty ? 'none' : 'block';
    if (empty) return;

    leaves.forEach(l=>{
      const row = document.createElement('div');
      row.className = 'row between';
      row.innerHTML = `
        <div class="row items">
          <div>Άδεια (Εγκεκριμένη) — <b>${l.owner_lastname || ''}</b></div>
          <input type="date" class="input" value="${l.from}" data-from-a="${l.id}"/>
          <span>→</span>
          <input type="date" class="input" value="${l.to}" data-to-a="${l.id}"/>
        </div>
        <div class="row">
          <button class="btn" data-save-a="${l.id}">Αποθήκευση</button>
        </div>`;
      host.appendChild(row);
    });

    host.querySelectorAll('[data-save-a]').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const id = b.getAttribute('data-save-a');
        const from = host.querySelector(`input[data-from-a="${id}"]`)?.value;
        const to   = host.querySelector(`input[data-to-a="${id}"]`)?.value;
        const r = await api(`/admin/leaves/${id}`, { method:'PATCH', body: JSON.stringify({ from, to }) });
        if (r.error) { alert(r.error); return; }
        await load();
      });
    });
  }
})();
