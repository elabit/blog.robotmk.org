export function init() {
  document.querySelectorAll('.lead-magnet-card__download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const formEl = document.getElementById(btn.getAttribute('aria-controls'));
      if (!formEl) return;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      formEl.hidden = expanded;
      if (!expanded) {
        formEl.querySelector('input[type="email"]')?.focus();
      }
    });
  });

  document.querySelectorAll('.lead-magnet-form__form').forEach(form => {
    const emailInput = form.querySelector('input[type="email"]');

    emailInput?.addEventListener('blur', () => {
      validateEmail(emailInput);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateEmail(emailInput)) return;

      const email = emailInput.value.trim();
      const listId = form.dataset.listId;
      const downloadUrl = form.dataset.downloadUrl;
      const confirm = form.closest('.lead-magnet-form').querySelector('.lead-magnet-form__confirm');
      const submitBtn = form.querySelector('[type="submit"]');

      submitBtn.disabled = true;

      try {
        if (listId) {
          await fetch('https://api.getresponse.com/v3/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Token': `api-key ${window.__GR_API_KEY || ''}` },
            body: JSON.stringify({ email, campaign: { campaignId: listId } }),
          });
        }

        form.hidden = true;
        if (confirm) confirm.hidden = false;

        if (downloadUrl) {
          setTimeout(() => { window.location.href = downloadUrl; }, 1200);
        }
      } catch {
        submitBtn.disabled = false;
      }
    });
  });
}

function validateEmail(input) {
  if (!input) return false;
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  input.setCustomValidity(valid ? '' : 'Please enter a valid email address.');
  input.reportValidity();
  return valid;
}
