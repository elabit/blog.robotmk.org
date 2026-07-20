export function init() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  const status = document.getElementById('newsletter-status');
  const webhook = form.dataset.webhook;
  if (!webhook) return;

  const msgErrorRequired = form.dataset.msgErrorRequired;
  const msgConfirm       = form.dataset.msgConfirm;
  const msgErrorSubmit   = form.dataset.msgErrorSubmit;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email || !form.consent.checked) {
      status.textContent = msgErrorRequired;
      status.dataset.state = 'error';
      return;
    }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    status.dataset.state = 'pending';
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          consent_text: form.querySelector('.newsletter-form__consent span').innerText.trim(),
          consent_timestamp: new Date().toISOString(),
          source_url: window.location.href
        })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.reset();
      status.textContent = msgConfirm;
      status.dataset.state = 'success';
      btn.disabled = false;
    } catch {
      status.textContent = msgErrorSubmit;
      status.dataset.state = 'error';
      btn.disabled = false;
    }
  });
}
