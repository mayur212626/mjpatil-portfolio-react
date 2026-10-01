import { useRef, useState } from 'react';
import { emailjsConfig, personalInfo, socialLinks } from '../data/portfolioData';
const configured = Object.values(emailjsConfig).every(value => value && !value.startsWith('YOUR_'));
export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [copyStatus, setCopyStatus] = useState('Copy email');
  async function copyEmail() {
    try { await navigator.clipboard.writeText(personalInfo.emails.primary); setCopyStatus('Email copied ✓'); }
    catch { setCopyStatus('Use the email link below'); }
  }
  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = formRef.current;
    const data = new FormData(form);
    if (![data.get('first_name'),data.get('user_email'),data.get('message')].every(value => value?.trim())) { setStatus('invalid'); return; }
    if (!configured) {
      const subject = encodeURIComponent(`Portfolio inquiry from ${data.get('first_name')} ${data.get('last_name')}`);
      const body = encodeURIComponent(`From: ${data.get('first_name')} ${data.get('last_name')}\nEmail: ${data.get('user_email')}\n\n${data.get('message')}`);
      window.location.href = `mailto:${personalInfo.emails.primary}?subject=${subject}&body=${body}`;
      setStatus('draft');
      return;
    }
    setStatus('sending');
    try { const emailjs = await import('@emailjs/browser'); await emailjs.sendForm(emailjsConfig.serviceId, emailjsConfig.templateId, form, emailjsConfig.publicKey); setStatus('sent'); form.reset(); }
    catch { setStatus('error'); }
  }
  const feedback = { invalid: 'Please add your name, email, and a message.', draft: 'Your email draft is ready. Send it from your email app to finish. Your message is still here if you need it.', sent: 'Message sent. Thank you for getting in touch.', error: 'The message could not be sent. Please retry or use the email link.', sending: 'Sending your message…' };
  return <section id="contact" className="contact-section"><div className="section-shell contact-grid"><div className="contact-intro"><p className="eyebrow">06 / Start a conversation</p><h2>Have a problem<br />worth <em>solving?</em></h2><p>Let’s talk about data science, ML engineering, research, or a project you have in mind.</p><a className="contact-email" href={`mailto:${personalInfo.emails.primary}`}>{personalInfo.emails.primary} ↗</a><button className="copy-email" type="button" onClick={copyEmail} aria-live="polite">{copyStatus}</button><div className="contact-socials"><a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a></div></div>
    <form ref={formRef} onSubmit={submit} className="contact-form" aria-label="Contact Mayur"><div className="form-names"><label htmlFor="firstName">First name <span>*</span><input id="firstName" name="first_name" autoComplete="given-name" maxLength={100} required placeholder="Your first name" /></label><label htmlFor="lastName">Last name<input id="lastName" name="last_name" autoComplete="family-name" maxLength={100} placeholder="Your last name" /></label></div><label htmlFor="email">Email <span>*</span><input id="email" name="user_email" type="email" autoComplete="email" maxLength={254} required placeholder="you@company.com" /></label><label htmlFor="message">What are you working on? <span>*</span><textarea id="message" name="message" rows={4} maxLength={5000} required placeholder="A little context goes a long way…" /></label><p className="form-note">{configured ? 'Your message goes directly to my inbox.' : 'This form prepares a draft in your email app.'}</p><button type="submit" className="primary-action" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : configured ? 'Send message ↗' : 'Prepare email ↗'}</button><p className="form-feedback" role="status">{feedback[status] || ''}</p></form>
  </div></section>;
}
