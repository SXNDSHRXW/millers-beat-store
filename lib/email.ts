import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

export async function sendFulfillmentEmail({
  to,
  beatTitle,
  licenseType,
  downloadUrl,
}: {
  to: string;
  beatTitle: string;
  licenseType: 'wav' | 'stems';
  downloadUrl: string;
}) {
  const licenseName = licenseType === 'wav' ? '.WAV License' : '.WAV + Stems License';

  await getResend().emails.send({
    from: 'MILLERS <beats@millers.store>',
    to,
    subject: `🥊 YOUR BEAT IS READY — ${beatTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { background: #050505; color: #f0f0f0; font-family: 'Courier New', monospace; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px; }
          .header { text-align: center; font-size: 32px; letter-spacing: 8px; margin-bottom: 8px; text-shadow: 0 0 20px #00d4ff; }
          .sub { text-align: center; color: #888; font-size: 12px; letter-spacing: 4px; margin-bottom: 40px; }
          .card { border: 2px solid #f0f0f0; padding: 30px; margin: 20px 0; }
          .beat-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #39ff14; text-shadow: 0 0 10px #39ff14; }
          .license { color: #00d4ff; font-size: 14px; letter-spacing: 2px; margin-bottom: 20px; }
          .download-btn { display: inline-block; background: #39ff14; color: #050505; padding: 15px 40px; text-decoration: none; font-weight: bold; letter-spacing: 2px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 11px; margin-top: 40px; }
          .divider { border-top: 1px solid #333; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">MILLERS</div>
          <div class="sub">BEAT STORE</div>

          <div class="card">
            <div class="beat">🎵 BEAT ACQUIRED</div>
            <div class="beat-title">${beatTitle}</div>
            <div class="license">${licenseName}</div>
            <div class="divider"></div>
            <p>Your files are ready for download. This link expires in 7 days.</p>
            <a href="${downloadUrl}" class="download-btn">DOWNLOAD FILES</a>
            <p style="font-size: 11px; color: #666;">If the button doesn't work, copy this link:<br>${downloadUrl}</p>
          </div>

          <div class="footer">
            NO AI. NO SAMPLES. ALL GAS.<br>
            MILLERS Beat Store
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
