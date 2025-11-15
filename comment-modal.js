// Comment Modal Functionality
// Configure an endpoint to send emails server-side.
// Preferred: Google Apps Script Web App URL that relays the message via Gmail.
// You can also set window.COMMENT_ENDPOINT in the page to override this placeholder.
const COMMENT_ENDPOINT = (typeof window !== 'undefined' && window.COMMENT_ENDPOINT)
    ? window.COMMENT_ENDPOINT
    : 'YOUR_APPS_SCRIPT_WEB_APP_URL';

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('commentModal');
    const btn = document.getElementById('commentBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('commentForm');
    const pageUrlInput = document.getElementById('pageUrl');

    // Open modal
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            if (pageUrlInput) {
                pageUrlInput.value = window.location.href;
            }
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Handle form submission via fetch to serverless endpoint (preferred)
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const message = (document.getElementById('comment')?.value || '').trim();
            if (!message) return;

            const payload = {
                nachricht: message,
                seite: window.location.href,
                ua: navigator.userAgent,
                zeit: new Date().toISOString()
            };

            try {
                const res = await fetch(COMMENT_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error('Request failed');

                // Success UI
                alert('Danke! Dein Kommentar wurde gesendet.');
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                form.reset();
            } catch (err) {
                console.error(err);
                alert('Senden fehlgeschlagen. Bitte später erneut versuchen.');
            }
        });
    }
});
