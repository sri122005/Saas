import React, { useState } from 'react';
import { GitFork, Zap, Layout, Activity, Shield, Check, Plus, Twitter, Github, Linkedin, ArrowRight } from 'lucide-react';

/* ============================================================
   Pure CSS Landing Page — no Tailwind, no inline overrides
   All styling is driven from index.css classes
   ============================================================ */

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const faqs = [
    {
      q: 'What is Halleyx exactly?',
      a: 'Halleyx is a headless workflow engine designed to run background logic, complex data pipelines, and automation flows at enterprise scale with no technical debt.'
    },
    {
      q: 'Do I need to manage any infrastructure?',
      a: 'No. Halleyx is fully managed. We handle the orchestration, server scaling, and state persistence so you can focus on building your product.'
    },
    {
      q: 'How secure is my data?',
      a: 'Extremely. We are SOC2 compliant, encrypt data at rest and in transit, and offer dedicated private VPC deployments for Enterprise customers.'
    }
  ];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" style={{ background: 'radial-gradient(circle at center, rgba(88,166,255,0.08) 0%, transparent 70%)' }}>
        <div className="hero-inner">
          <span className="badge badge-info" style={{ gap: '6px', fontSize: '11px' }}>
            <Zap size={12} />
            10x Faster Workflows
          </span>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: '900', lineHeight: 0.92, letterSpacing: '-0.04em' }}>
            Automate your <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>complex</span> logic{' '}
            <span style={{ textDecoration: 'underline', textDecorationThickness: '3px', textUnderlineOffset: '6px', color: 'var(--info)' }}>in seconds</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.7 }}>
            The enterprise-grade engine for modern teams. Build, monitor, and scale your backend logic without the technical debt.
          </p>
          <div className="hero-cta-group">
            <a href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 32px', borderRadius: '16px',
              background: 'var(--primary)', color: '#fff',
              fontWeight: '700', fontSize: '15px',
              textDecoration: 'none', transition: 'all 0.2s'
            }}>
              Start Building Now <ArrowRight size={16} />
            </a>
            <button style={{
              padding: '14px 32px', borderRadius: '16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)', fontWeight: '700', fontSize: '15px'
            }}>
              Watch the Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── LOGO STRIP ───────────────────────────────────── */}
      <section className="section" style={{ padding: '40px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
            alignItems: 'center', gap: '24px', opacity: '0.4'
          }}>
            {['VELOCITY', 'STRIPE', 'VERCEL', 'LINEAR', 'RAYCAST'].map(name => (
              <span key={name} style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-heading">
            <span className="badge badge-info" style={{ fontSize: '10px' }}>Enterprise Suite</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '700' }}>
              Everything you need to ship <span style={{ textDecoration: 'underline', textDecorationThickness: '2px', textUnderlineOffset: '4px', color: 'var(--info)' }}>faster</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              A complete toolkit designed for high-performance engineering teams.
            </p>
          </div>

          <div className="features-grid">
            {[
              { icon: <Layout size={22} />, title: 'Visual Builder', desc: 'Design multi-step automations with our intuitive drag-and-drop node interface. No code required for logic setup.', color: 'var(--primary)' },
              { icon: <Activity size={22} />, title: 'Real-time Metrics', desc: 'Track every execution with microsecond precision. Identify bottlenecks and auto-scale resources dynamically.', color: 'var(--info)' },
              { icon: <Shield size={22} />, title: 'Ironclad Security', desc: 'SOC2 Type II compliant with role-based access control and full immutable audit trails for every state change.', color: 'var(--text-secondary)' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className="feature-card">
                <div className="icon" style={{ background: `${color}20`, color }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <span className="badge badge-info" style={{ fontSize: '10px' }}>Workflow</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '700' }}>
              From concept to scale in <span style={{ fontStyle: 'italic', color: 'var(--info)' }}>3 steps</span>
            </h2>
          </div>

          <div className="steps-grid">
            {[
              { n: '01', title: 'Define Schema', desc: 'Map your data inputs and triggers with a few clicks.' },
              { n: '02', title: 'Bridge Logic', desc: 'Chain steps and define conditional rules in our core engine.' },
              { n: '03', title: 'Auto Deploy', desc: 'Scale instantly on our high-speed global node network.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="step-item">
                <div className="step-number">{n}</div>
                <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{title}</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '240px' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '700' }}>Trusted by builders</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { quote: '"Halleyx reduced our manual operational tasks by 90%. We can now focus on building features instead of fixing broken pipelines."', name: 'Alex Rivera', role: 'Head of Operations, Velocity', initials: 'AR' },
              { quote: '"The most intuitive workflow engine I\'ve ever integrated. The visual debugging alone saved us weeks of engineering time."', name: 'Sarah Chen', role: 'Senior Architect, Vercel', initials: 'SC' },
              { quote: '"Enterprise reliability with a developer experience that actually makes sense. It\'s the standard for our backend stack now."', name: 'James Wilson', role: 'Founder, Stealth SaaS', initials: 'JW' },
            ].map(({ quote, name, role, initials }) => (
              <div key={name} className="testimonial-card">
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, fontStyle: 'italic' }}>{quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: 'var(--primary)', color: '#fff', fontWeight: '700', fontSize: '13px' }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section id="pricing" className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '700' }}>Pricing for any scale</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Start free, scale as you grow.</p>
          </div>
          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-card">
              <div>
                <h3 style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Free</h3>
                <div style={{ fontSize: '36px', fontWeight: '900', margin: '12px 0' }}>$0 <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-muted)' }}>/forever</span></div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
              </div>
              <ul className="pricing-features-list">
                {['1,000 executions/mo', 'Up to 3 active flows', 'Standard monitoring'].map(f => (
                  <li key={f} className="pricing-feature-row" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <Check size={16} style={{ color: 'var(--primary)' }} /> {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-secondary btn-full pricing-cta">Get Started</button>
            </div>
            {/* Pro (featured) */}
            <div className="pricing-card featured" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--primary)', color: '#fff',
                fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em',
                padding: '4px 14px', borderRadius: '20px'
              }}>Most Popular</div>
              <div>
                <h3 style={{ fontWeight: '700', color: 'var(--primary)' }}>Pro</h3>
                <div style={{ fontSize: '36px', fontWeight: '900', margin: '12px 0' }}>$49 <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-muted)' }}>/month</span></div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
              </div>
              <ul className="pricing-features-list">
                {['50,000 executions/mo', 'Unlimited active flows', 'Advanced trace logging', 'Webhook integrations'].map(f => (
                  <li key={f} className="pricing-feature-row" style={{ fontSize: '14px' }}>
                    <Check size={16} style={{ color: 'var(--primary)' }} /> {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-full pricing-cta" style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700' }}>
                Go Professional
              </button>
            </div>
            {/* Enterprise */}
            <div className="pricing-card">
              <div>
                <h3 style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Enterprise</h3>
                <div style={{ fontSize: '36px', fontWeight: '900', margin: '12px 0' }}>Custom</div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
              </div>
              <ul className="pricing-features-list">
                {['Unlimited throughput', 'Dedicated node engine', 'SOC2 Compliance kit', '24/7 Dedicated Slack'].map(f => (
                  <li key={f} className="pricing-feature-row" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <Check size={16} style={{ color: 'var(--primary)' }} /> {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-secondary btn-full pricing-cta">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="section">
        <div className="container">
          <div className="section-heading">
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '700' }}>FAQ</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => toggleFaq(i)}>
                  <span style={{ fontWeight: '600', fontSize: '15px' }}>{faq.q}</span>
                  <Plus size={18} style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease', color: 'var(--text-muted)' }} />
                </button>
                {openFaq === i && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="cta-banner" style={{ background: 'var(--bg-secondary)' }}>
        <div className="cta-banner-inner">
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1 }}>
            Ready to build the future of automation?
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
            Join 5,000+ top-tier engineering teams already scaling with Halleyx.
          </p>
          <a href="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 40px', borderRadius: '16px',
            background: 'var(--primary)', color: '#fff',
            fontWeight: '700', fontSize: '16px',
            textDecoration: 'none'
          }}>
            Build your first flow — for free
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="icon-row" style={{ marginBottom: '8px' }}>
                <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <GitFork size={16} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>HALLEYX</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                The next-generation engine for workflow automation. Built for the modern web.
              </p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title" style={{ color: 'var(--primary)' }}>Product</div>
              {['Engine Core', 'Visual Designer', 'Security', 'Enterprise'].map(l => <a key={l} href="#">{l}</a>)}
            </div>
            <div className="footer-col">
              <div className="footer-col-title" style={{ color: 'var(--info)' }}>Company</div>
              {['About', 'Careers', 'Blog', 'Contact'].map(l => <a key={l} href="#">{l}</a>)}
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Resources</div>
              {['Docs', 'Help Center', 'API Status', 'Privacy'].map(l => <a key={l} href="#">{l}</a>)}
            </div>
          </div>

          <div className="footer-bottom">
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>© 2026 Halleyx Inc. Built for heavy impact.</span>
            <div className="footer-social">
              <a href="#"><Twitter size={18} /></a>
              <a href="#"><Github size={18} /></a>
              <a href="#"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
