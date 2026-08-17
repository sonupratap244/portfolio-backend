// utils/emailTemplates.js
export const contactEmailTemplate = (contact) => {
  return {
    adminSubject: `New Contact Message from ${contact.name}`,
    adminHtml: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          body { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6); padding: 40px 50px; text-align: center; position: relative; overflow: hidden; }
          .header::before { content: ''; position: absolute; top: -50%; right: -20%; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; }
          .header::after { content: ''; position: absolute; bottom: -40%; left: -10%; width: 250px; height: 250px; background: rgba(255,255,255,0.08); border-radius: 50%; }
          .header h1 { color: white; font-size: 32px; font-weight: 800; position: relative; z-index: 1; letter-spacing: -0.5px; }
          .header .badge { display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); color: white; padding: 6px 20px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-top: 12px; border: 1px solid rgba(255,255,255,0.3); position: relative; z-index: 1; }
          .header .emoji { font-size: 48px; display: block; margin-bottom: 12px; position: relative; z-index: 1; }
          .body { padding: 40px 50px; }
          .body h2 { color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 6px; }
          .body .subtitle { color: #64748b; font-size: 15px; margin-bottom: 28px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
          .info-item { background: #f8fafc; border-radius: 12px; padding: 16px 20px; border-left: 4px solid #06b6d4; }
          .info-item.full { grid-column: 1 / -1; }
          .info-item .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
          .info-item .value { font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 4px; }
          .message-box { background: #f1f5f9; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
          .message-box .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
          .message-box p { color: #334155; line-height: 1.7; font-size: 15px; }
          .divider { border: none; height: 1px; background: linear-gradient(to right, #e2e8f0, transparent); margin: 24px 0; }
          .footer { text-align: center; padding: 30px 50px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
          .footer p { color: #64748b; font-size: 14px; line-height: 1.6; }
          .footer .brand { font-size: 18px; font-weight: 800; background: linear-gradient(135deg, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .reply-btn { display: inline-block; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white !important; padding: 12px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; margin-top: 12px; font-size: 15px; box-shadow: 0 4px 15px rgba(6,182,212,0.4); }
          .reply-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(6,182,212,0.5); }
          @media (max-width: 600px) { .body { padding: 30px 24px; } .header { padding: 30px 24px; } .header h1 { font-size: 24px; } .info-grid { grid-template-columns: 1fr; } .footer { padding: 24px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="emoji">📬</span>
            <h1>New Contact Message</h1>
            <span class="badge">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="body">
            <h2>You have a new message from ${contact.name}</h2>
            <p class="subtitle">A potential client or collaborator has reached out through your portfolio.</p>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">👤 Name</div>
                <div class="value">${contact.name}</div>
              </div>
              <div class="info-item">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:${contact.email}" style="color:#06b6d4;text-decoration:none;">${contact.email}</a></div>
              </div>
              <div class="info-item">
                <div class="label">📱 Mobile</div>
                <div class="value"><a href="tel:${contact.mobile}" style="color:#06b6d4;text-decoration:none;">${contact.mobile}</a></div>
              </div>
              <div class="info-item">
                <div class="label">📅 Date</div>
                <div class="value">${new Date(contact.createdAt).toLocaleString()}</div>
              </div>
              <div class="info-item full">
                <div class="label">📝 Message</div>
                <div class="value" style="font-weight:400;color:#475569;line-height:1.6;">${contact.message}</div>
              </div>
            </div>
            <div style="text-align:center;">
              <a href="mailto:${contact.email}?subject=Re: ${contact.name} - Portfolio Response" class="reply-btn">✉️ Reply to ${contact.name}</a>
            </div>
            <hr class="divider">
            <div style="text-align:center;padding:12px 0;background:#f1f5f9;border-radius:12px;">
              <p style="font-size:14px;color:#334155;">📱 <a href="tel:${contact.mobile}" style="color:#06b6d4;text-decoration:none;font-weight:600;">${contact.mobile}</a> &nbsp;·&nbsp; 📧 <a href="mailto:${contact.email}" style="color:#06b6d4;text-decoration:none;font-weight:600;">${contact.email}</a></p>
            </div>
          </div>
          <div class="footer">
            <p><span class="brand">✦ Son Pratap</span><br>Full Stack Developer · Portfolio Dashboard</p>
            <p style="font-size:12px;color:#94a3b8;margin-top:8px;">This is an automated notification from your portfolio admin panel.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    userSubject: "Thank you for contacting! - Son Pratap",
    userHtml: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting!</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          body { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6); padding: 40px 50px; text-align: center; position: relative; overflow: hidden; }
          .header::before { content: ''; position: absolute; top: -50%; right: -20%; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; }
          .header::after { content: ''; position: absolute; bottom: -40%; left: -10%; width: 250px; height: 250px; background: rgba(255,255,255,0.08); border-radius: 50%; }
          .header h1 { color: white; font-size: 32px; font-weight: 800; position: relative; z-index: 1; letter-spacing: -0.5px; }
          .header .badge { display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); color: white; padding: 6px 20px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-top: 12px; border: 1px solid rgba(255,255,255,0.3); position: relative; z-index: 1; }
          .header .emoji { font-size: 48px; display: block; margin-bottom: 12px; position: relative; z-index: 1; }
          .body { padding: 40px 50px; }
          .body h2 { color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 6px; }
          .body .subtitle { color: #64748b; font-size: 15px; margin-bottom: 28px; }
          .message-box { background: #f1f5f9; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; border-left: 4px solid #06b6d4; }
          .message-box .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
          .message-box p { color: #334155; line-height: 1.7; font-size: 15px; }
          .divider { border: none; height: 1px; background: linear-gradient(to right, #e2e8f0, transparent); margin: 24px 0; }
          .footer { text-align: center; padding: 30px 50px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
          .footer p { color: #64748b; font-size: 14px; line-height: 1.6; }
          .footer .brand { font-size: 18px; font-weight: 800; background: linear-gradient(135deg, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .social-links { display: flex; justify-content: center; gap: 12px; margin: 16px 0 8px; }
          .social-links a { display: inline-block; padding: 8px 16px; background: #f1f5f9; border-radius: 8px; color: #0f172a; text-decoration: none; font-size: 13px; font-weight: 600; transition: all 0.3s ease; }
          .social-links a:hover { background: #e2e8f0; transform: translateY(-2px); }
          .social-links a.github { background: #0f172a; color: white; }
          .social-links a.github:hover { background: #1e293b; }
          .social-links a.linkedin { background: #0a66c2; color: white; }
          .social-links a.linkedin:hover { background: #004182; }
          @media (max-width: 600px) { .body { padding: 30px 24px; } .header { padding: 30px 24px; } .header h1 { font-size: 24px; } .footer { padding: 24px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="emoji">🙏</span>
            <h1>Thank you for reaching out!</h1>
            <span class="badge">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div class="body">
            <h2>Dear ${contact.name},</h2>
            <p class="subtitle">Thank you for contacting me through my portfolio.</p>
            <p style="color:#475569;line-height:1.8;margin-bottom:20px;">I have received your message and will get back to you within <strong>24 hours</strong>. I appreciate your interest in my work and look forward to discussing how I can help you.</p>
            <div class="message-box">
              <div class="label">📝 Your Message</div>
              <p>${contact.message}</p>
            </div>
            <div style="background:#ecfdf5;border-radius:12px;padding:16px 20px;margin-bottom:24px;border-left:4px solid #10b981;">
              <p style="font-size:14px;color:#065f46;">✅ Your message has been received. I'll respond within 24 hours.</p>
            </div>
            <hr class="divider">
           
          </div>
          <div class="footer">
            <p><span class="brand">✦ Son Pratap</span><br>Full Stack Developer</p>
            <p style="font-size:13px;color:#94a3b8;margin-top:8px;">
              📧 <a href="mailto:${process.env.EMAIL_USER}" style="color:#06b6d4;text-decoration:none;">${process.env.EMAIL_USER}</a>
              &nbsp;·&nbsp; 📱 <a href="tel:+918303255391" style="color:#06b6d4;text-decoration:none;">+91 8303255391</a>
            </p>
            <p style="font-size:12px;color:#94a3b8;margin-top:8px;">This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};