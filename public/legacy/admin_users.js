// admin_users.js
(async function(){
  await protect('admin');
  document.getElementById('logout').addEventListener('click', logout);
  document.getElementById('backBtn').addEventListener('click', ()=> location.href='/admin');

  const fn = document.getElementById('fn');
  const ln = document.getElementById('ln');
  const mob = document.getElementById('mob');
  const usersDiv = document.getElementById('users');

  async function load(){
    const users = await api('/admin/users/list');
    usersDiv.innerHTML = '';
    users.forEach(u=>{
      const row = document.createElement('div');
      row.className = 'row between';
      row.innerHTML = `
        <div>${u.first_name} ${u.last_name} — <b>${u.mobile}</b> — ${u.role}</div>
        <div><button class="btn danger" data-id="${u.id}">Διαγραφή</button></div>`;
      usersDiv.appendChild(row);
    });
    usersDiv.querySelectorAll('.btn.danger').forEach(b=>{
      b.addEventListener('click', async ()=>{
        if (!confirm('Διαγραφή χρήστη;')) return;
        const id = b.dataset.id;
        const r = await api('/admin/users/'+id, { method:'DELETE' });
        if (r.error) return alert(r.error);
        await load();
      });
    });
  }
  await load();

  document.getElementById('add').addEventListener('click', async ()=>{
    const r = await api('/admin/users', {
      method:'POST',
      body: JSON.stringify({ first_name: fn.value.trim(), last_name: ln.value.trim(), mobile: mob.value.trim() })
    });
    if (r.error) return alert(r.error);
    fn.value=''; ln.value=''; mob.value='';
    await load();
  });
})();
