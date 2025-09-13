export async function GET() {
  const html = `<!doctype html>
<html><body>
  <form id="f" method="POST" action="/api/auth/signout">
    <input type="hidden" name="callbackUrl" value="/" />
    <input type="hidden" name="csrfToken" value="" />
  </form>
  <script>
    fetch('/api/auth/csrf')
      .then(r => r.json())
      .then(({ csrfToken }) => {
        document.querySelector('input[name="csrfToken"]').value = csrfToken;
        document.getElementById('f').submit();
      })
      .catch(() => { window.location.href = '/'; });
  </script>
</body></html>`;
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
