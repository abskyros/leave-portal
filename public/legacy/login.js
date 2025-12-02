// public/login.js
(function(){
  const mobile   = document.getElementById('mobile');
  const password = document.getElementById('password');
  const msg      = document.getElementById('msg');
  const loginBtn = document.getElementById('loginBtn');

  const box      = document.getElementById('firstLoginBox');
  const newpass  = document.getElementById('newpass');
  const changeBtn= document.getElementById('changeBtn');

  function showError(text){ msg.textContent = text || 'Κάτι πήγε στραβά.'; }

  loginBtn.addEventListener('click', async () => {
    msg.textContent = '';
    try {
      const r = await api('/auth/login', {
        method:'POST',
        body: JSON.stringify({ mobile: (mobile.value||'').trim(), password: password.value||'' })
      });
      if (r?.error) return showError(r.error);
      if (!r?.token) return showError('Αδυναμία σύνδεσης.');

      saveToken(r.token);
      if (r.must_change_password) {
        box.classList.remove('hidden');
        msg.textContent = 'Πρώτη είσοδος: ορίστε νέο κωδικό.';
        return;
      }
      const me = await api('/me');
      if (me?.role === 'admin') location.href = '/admin';
      else location.href = '/user';
    } catch { showError('Σφάλμα δικτύου.'); }
  });

  changeBtn.addEventListener('click', async ()=>{
    msg.textContent = '';
    try{
      const r = await api('/auth/change-password', {
        method:'POST',
        body: JSON.stringify({ old_password:'1082', new_password: newpass.value||'' })
      });
      if (r?.error) return showError(r.error);
      if (!r?.token) return showError('Αποτυχία αλλαγής κωδικού.');
      saveToken(r.token);
      const me = await api('/me');
      if (me?.role === 'admin') location.href = '/admin';
      else location.href = '/user';
    } catch { showError('Σφάλμα δικτύου.'); }
  });
})();
