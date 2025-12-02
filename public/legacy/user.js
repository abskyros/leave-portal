// user.js
(async function(){
  await protect();
  const userName = document.getElementById('userName');
  const calendar = document.getElementById('calendar');
  const myList = document.getElementById('myList');
  const from = document.getElementById('from');
  const to = document.getElementById('to');
  const repoDate = document.getElementById('repoDate');
  document.getElementById('logout').addEventListener('click', logout);

  async function load(){
    const me = await api('/me');
    userName.textContent = `${me.first_name} ${me.last_name}`;
    const model = await api('/calendar');
    renderCalendar(model, calendar);
    renderMine(model, myList);
  }
  await load();

  document.getElementById('addLeave').addEventListener('click', async ()=>{
    const r = await api('/leaves', { method:'POST', body: JSON.stringify({ from: from.value, to: to.value }) });
    if (r.error) return alert(r.error);
    from.value=''; to.value='';
    location.reload();
  });

  document.getElementById('addRepo').addEventListener('click', async ()=>{
    const r = await api('/repos', { method:'POST', body: JSON.stringify({ date: repoDate.value }) });
    if (r.error) return alert(r.error);
    repoDate.value='';
    location.reload();
  });
})();
