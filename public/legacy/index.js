// index.js
const mobile = document.getElementById('mobile');
const password = document.getElementById('password');
const msg = document.getElementById('msg');
const loginBtn = document.getElementById('loginBtn');
const box = document.getElementById('firstLoginBox');
const newpass = document.getElementById('newpass');
const changeBtn = document.getElementById('changeBtn');

let lastToken = null;

loginBtn.addEventListener('click', async ()=>{
  msg.textContent = '';
  const r = await api('/auth/login', {
    method:'POST',
    body: JSON.stringify({ mobile: mobile.value.trim(), password: password.value })
  });
  if (r.error) { msg.textContent = r.error; return; }
  saveToken(r.token);
  lastToken = r.token;

  if (r.must_change_password) {
    box.classList.remove('hidden');
    msg.textContent = 'Παρακαλώ ορίστε νέο κωδικό.';
  } else {
    const me = await api('/me');
    if (me.role === 'admin') location.href = '/admin';
    else location.href = '/user';
  }
});

changeBtn.addEventListener('click', async ()=>{
  msg.textContent = '';
  const r = await api('/auth/change-password', {
    method:'POST',
    body: JSON.stringify({ old_password:'1082', new_password: newpass.value })
  });
  if (r.error) { msg.textContent = r.error; return; }
  saveToken(r.token);
  const me = await api('/me');
  if (me.role === 'admin') location.href = '/admin';
  else location.href = '/user';
});
