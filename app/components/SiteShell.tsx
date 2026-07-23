"use client";
/* eslint-disable @next/next/no-img-element -- vinext local image optimizer requires an ASSETS binding unavailable in development; assets are local, dimensioned and deployment-safe. */

import { useEffect, useRef, useState } from "react";
import { getTelephoneUrl, getWhatsAppUrl, siteConfig } from "../site-config";
import type { TreatmentCategory } from "../site-config";

const nav = [
  ["Início", "#inicio"], ["Clínica", "#clinica"], ["Tratamentos", "#tratamentos"],
  ["Equipe", "#equipe"], ["Convênios", "#convenios"], ["Dúvidas", "#duvidas"], ["Contato", "#contato"],
] as const;

const heroInsurances = [
  { name: "Servdonto", logo: "/insurance-servdonto.png" },
  { name: "INPAO Dental", logo: "/insurance-inpao.png" },
  { name: "Porto Saúde", logo: "/insurance-porto-saude.png" },
] as const;

const procedureVisuals: Record<string, { image: string; position?: string }> = {
  "Implante dentário": { image: "/procedures/implante-dentario.png", position: "center" },
  "Coroa dentária": { image: "/procedures/coroa-dentaria.png", position: "center" },
  "Canal (tratamento endodôntico)": { image: "/procedures/procedures-sprite.png", position: "0% 0%" },
  "Prótese dentária": { image: "/procedures/procedures-sprite.png", position: "25% 0%" },
  "Restauração": { image: "/procedures/procedures-sprite.png", position: "50% 0%" },
  "Extração dentária": { image: "/procedures/procedures-sprite.png", position: "75% 0%" },
  "Limpeza e raspagem": { image: "/procedures/procedures-sprite.png", position: "100% 0%" },
  "Periodontia (tratamento de gengiva)": { image: "/procedures/procedures-sprite.png", position: "0% 100%" },
  "Aparelho estético (ortodontia)": { image: "/procedures/procedures-sprite.png", position: "25% 100%" },
  "Facetas": { image: "/procedures/faceta-porcelana.png", position: "center" },
  "Lentes de contato": { image: "/procedures/procedures-sprite.png", position: "50% 100%" },
  "Clareamento dental": { image: "/procedures/procedures-sprite.png", position: "75% 100%" },
  "Faceta de resina": { image: "/procedures/procedures-sprite.png", position: "100% 100%" },
  "Faceta de porcelana": { image: "/procedures/faceta-porcelana.png", position: "center" },
};

function normalizeTreatmentCategories(categories: readonly TreatmentCategory[]): TreatmentCategory[] {
  const dental = categories.find((category) => category.name === "Procedimentos odontológicos");
  const aesthetic = categories.find((category) => category.name === "Estética do sorriso");
  if (!dental || !aesthetic) return [...categories];

  const orthodontics = [...dental.procedures, ...aesthetic.procedures].find((procedure) => procedure.name === "Aparelho estético (ortodontia)");
  const dentalProcedures = dental.procedures.filter((procedure) => procedure.name !== "Aparelho estético (ortodontia)");
  const aestheticProcedures = aesthetic.procedures.filter((procedure) => !["Lentes de contato", "Faceta de resina", "Faceta de porcelana", "Facetas", "Aparelho estético (ortodontia)"].includes(procedure.name));

  return categories.map((category) => {
    if (category.name === dental.name) return { ...category, procedures: dentalProcedures };
    if (category.name === aesthetic.name) return {
      ...category,
      procedures: [
        { name: "Facetas", description: "Tratamentos estéticos personalizados com opções em resina, porcelana e lentes de contato, definidos conforme avaliação e planejamento clínico." },
        ...aestheticProcedures,
        ...(orthodontics ? [orthodontics] : []),
      ],
    };
    return category;
  });
}

function trackConversion(context: string) {
  window.dispatchEvent(new CustomEvent("whatsapp_click", { detail: { context } }));
}

function WhatsAppLink({ label = "Agendar pelo WhatsApp", treatment, className = "button primary" }: { label?: string; treatment?: string; className?: string }) {
  const message = treatment ? siteConfig.whatsapp.treatmentMessage(treatment) : siteConfig.whatsapp.defaultMessage;
  const href = getWhatsAppUrl(message);
  if (!href && className === "floating-whatsapp") return null;
  if (!href) return <span className={`${className} disabled`} aria-disabled="true" title="Configure o WhatsApp em app/site-config.ts">WhatsApp em configuração</span>;
  if (className === "floating-whatsapp") return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label="Solicitar orçamento pelo WhatsApp" onClick={() => trackConversion(treatment ?? "geral")}><img src="/whatsapp-icon.png" width="72" height="72" alt="" aria-hidden="true" /></a>;
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion(treatment ?? "geral")}>{label}<span aria-hidden="true"> ↗</span></a>;
}

export function SiteShell() {
  const config = {
    ...siteConfig,
    treatmentCategories: normalizeTreatmentCategories(siteConfig.treatmentCategories),
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [clinicSlide, setClinicSlide] = useState(0);
  const [teamIndex, setTeamIndex] = useState(0);
  const [clinicPaused, setClinicPaused] = useState(false);
  const [teamPaused, setTeamPaused] = useState(false);
  const [treatmentCategory, setTreatmentCategory] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        (entry.target as HTMLElement).classList.toggle("is-visible", entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    items.forEach((item) => observer.observe(item));
    return () => { document.removeEventListener("keydown", close); observer.disconnect(); };
  }, [menuOpen]);
  useEffect(() => {
    const updateHeader = () => {
      const progress = Math.min(1, window.scrollY / Math.max(240, window.innerHeight * 0.62));
      setHeaderScrolled(progress > 0.42);
      headerRef.current?.style.setProperty("--header-progress", String(progress));
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, []);
  useEffect(() => {
    if (menuOpen) navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
  }, [menuOpen]);
  useEffect(() => {
    if (clinicPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setClinicSlide((current) => (current + 1) % 2), 3000);
    return () => window.clearInterval(timer);
  }, [clinicPaused]);
  useEffect(() => {
    if (teamPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setTeamIndex((current) => (current + 1) % config.professionals.length), 30000);
    return () => window.clearInterval(timer);
  }, [teamPaused, config.professionals.length]);

  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header ref={headerRef} className={`site-header ${headerScrolled ? "is-scrolled" : ""}`}>
      <a href="#inicio" className="brand" aria-label="Jr Odontologia — início">
        <img src="/logo-jr-transparent.png" width="96" height="96" alt="Jr Odontologia" />
      </a>
      <nav ref={navRef} id="main-nav" className={menuOpen ? "nav open" : "nav"} aria-label="Navegação principal">
        {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <WhatsAppLink className="button primary nav-cta" />
      </nav>
      <button ref={menuButtonRef} className="menu-button" aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen(v => !v)}>
        <span></span><span></span><span></span>
      </button>
    </header>

    <main id="conteudo">
      <section className="hero" id="inicio">
        <div className="orb orb-one" aria-hidden="true"></div><div className="orb orb-two" aria-hidden="true"></div>
        <div className="hero-content" data-reveal>
          <h1>Seu sorriso merece <em>cuidado por inteiro.</em></h1>
          <p className="hero-copy">Clínica odontológica em Cubatão, SP, que reúne profissionais reconhecidos na Baixada Santista. Oferecemos cuidado completo, da prevenção e manutenção aos tratamentos estéticos, sempre com avaliação responsável e atendimento próximo.</p>
          <div className="hero-actions"><WhatsAppLink /><a href="#clinica" className="button secondary">Conheça nossa localização <span aria-hidden="true">↓</span></a></div>
          <p className="helper">O atendimento e a confirmação de disponibilidade acontecem pelo WhatsApp.</p>
        </div>
        <div className="hero-visual smile-glass" data-reveal>
          <img src="/hero-smile.webp" width="1024" height="1536" alt="Sorriso natural iluminado sobre fundo preto" fetchPriority="high" />
          <div className="glass-note"><span className="pulse" aria-hidden="true"></span><div><strong>Seu sorriso, sua história</strong><small>Cuidado próximo em todas as fases</small></div></div>
        </div>
        <div className="hero-insurance" id="convenios" data-reveal aria-label="Convênios odontológicos atendidos">
          <p>Convênios atendidos</p>
          <div className="hero-insurance-viewport"><div className="hero-insurance-track">{[0, 1].map((loop) => <div className="hero-insurance-set" key={loop} aria-hidden={loop === 1}>{heroInsurances.map((insurance) => <span key={`${loop}-${insurance.name}`}><img src={insurance.logo} width="520" height="220" alt={loop === 0 ? insurance.name : ""} /></span>)}</div>)}</div></div>
        </div>
      </section>

      <section className="section clinic-story" id="equipe" aria-labelledby="clinica-story-title">
        <div className="team-carousel" data-reveal aria-roledescription="carrossel" aria-label="Profissionais da Jr Odontologia" onMouseEnter={() => setTeamPaused(true)} onMouseLeave={() => setTeamPaused(false)} onFocusCapture={() => setTeamPaused(true)} onBlurCapture={(event) => !event.currentTarget.contains(event.relatedTarget) && setTeamPaused(false)}><div className="team-carousel-track" style={{ transform: `translateX(-${teamIndex * 100}%)` }}>{config.professionals.map((person, i) => <article className="team-slide" key={person.name} aria-hidden={i !== teamIndex}>{person.photo ? <div className="portrait-photo"><img src={person.photo} width="1024" height="1536" alt={`Fotografia de ${person.name}`} loading="lazy" /></div> : <div className="portrait-placeholder" aria-label="Fotografia profissional pendente"><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><small>Foto será adicionada em breve</small></div>}<div className="team-slide-copy"><p className="status">EQUIPE JR ODONTOLOGIA</p><h3>{person.name}</h3><p className="specialty">{person.specialty} · {person.cro}</p><p>{person.bio}</p>{"highlights" in person && person.highlights && <ul className="professional-highlights">{person.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}</div></article>)}</div><div className="team-carousel-controls"><button type="button" onClick={() => setTeamIndex((teamIndex - 1 + config.professionals.length) % config.professionals.length)} aria-label="Profissional anterior">‹</button><button type="button" onClick={() => setTeamIndex((teamIndex + 1) % config.professionals.length)} aria-label="Próximo profissional">›</button></div></div>
        <div className="story-copy" data-reveal><p className="eyebrow dark"><span></span> Três profissionais, um só cuidado</p><h2 id="clinica-story-title">Odontologia completa, feita por uma equipe que trabalha junto.</h2><p>Na Jr Odontologia, três cirurgiões-dentistas reúnem diferentes áreas de atuação para acompanhar prevenção, estética, reabilitação e urgências com uma visão integrada. Cada caso é conversado em equipe quando necessário, sempre com explicações claras e um plano adequado à realidade de cada pessoa.</p><WhatsAppLink label="Conhecer a clínica pelo WhatsApp" /></div>
      </section>

      <section className="section place-showcase" id="clinica">
        <div className="place-main" data-reveal><h2>Fácil de encontrar.<br />Bom de chegar.</h2><p>No Centro de Cubatão, acima do Centro Médico Popular e na esquina com a Praça Princesa Isabel. Consulte a rota e fale com a equipe antes de sair.</p></div>
        <button className="clinic-photo-stack compact" data-reveal type="button" onClick={() => setClinicSlide((current) => (current + 1) % 2)} onMouseEnter={() => setClinicPaused(true)} onMouseLeave={() => setClinicPaused(false)} onFocus={() => setClinicPaused(true)} onBlur={() => setClinicPaused(false)} aria-label="Alternar entre foto ilustrativa da fachada e do consultório"><img className={clinicSlide === 0 ? "active" : ""} src="/clinic-facade-illustrative.webp" width="1024" height="1280" alt="Imagem ilustrativa da fachada de uma clínica odontológica" loading="lazy" /><img className={clinicSlide === 1 ? "active" : ""} src="/clinic-office-illustrative.webp" width="1024" height="1280" alt="Imagem ilustrativa de um consultório odontológico" loading="lazy" /><span>Imagem ilustrativa · toque para alternar</span><i aria-hidden="true">{clinicSlide + 1} / 2</i></button>
        <div className="place-contact" data-reveal><div className="place-grid"><div><span>Endereço</span><strong>{config.clinic.address}</strong><small>{config.clinic.neighborhood} · {config.clinic.city} · CEP {config.clinic.postalCode}</small></div><div><span>Instagram</span><strong>{config.clinic.instagramHandle}</strong><a href={config.clinic.instagram} target="_blank" rel="noopener noreferrer">Abrir perfil ↗</a></div><div><span>WhatsApp</span><strong>{config.clinic.phoneDisplay}</strong><small>Atendimento e orçamento pelo aplicativo</small></div><a className="map-preview" href={config.clinic.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Abrir a localização da Jr Odontologia no Google Maps"><span className="map-road road-one">Praça Princesa Isabel</span><span className="map-road road-two">Rua Bahia</span><i aria-hidden="true"></i><strong>JR Odontologia<br />Rua Bahia, 21</strong><small>Abrir no Google Maps ↗</small></a></div><div className="place-actions"><a href={config.clinic.mapUrl} target="_blank" rel="noopener noreferrer" className="button primary">Visualizar no Google Maps ↗</a><WhatsAppLink label="Falar pelo WhatsApp" className="button secondary" /></div></div>
      </section>

      <section className="section treatments" id="tratamentos">
        <div className="section-heading split" data-reveal><div><p className="eyebrow"><span></span> Tratamentos</p><h2>Duas áreas de cuidado, um atendimento integrado.</h2></div><p>Explore os procedimentos odontológicos e de estética do sorriso oferecidos pela equipe. Cada indicação é definida somente após avaliação profissional.</p></div>
        <div className="treatment-selector" role="tablist" aria-label="Selecione uma área de tratamento" data-reveal>{config.treatmentCategories.map((category, index) => <button key={category.name} type="button" role="tab" aria-selected={treatmentCategory === index} aria-controls="treatment-panel" className={treatmentCategory === index ? "active" : ""} onClick={() => setTreatmentCategory(index)}><span>{String(index + 1).padStart(2, "0")}</span>{category.name}<small>{category.procedures.length} procedimentos</small></button>)}</div>
        <div className="procedure-card-grid" id="treatment-panel" role="tabpanel" data-reveal>{config.treatmentCategories[treatmentCategory].procedures.map((procedure) => { const visual = procedureVisuals[procedure.name]; return <article className="procedure-card" key={procedure.name}><div className={`procedure-photo${visual?.image.includes("sprite") ? " procedure-photo-sprite" : ""}`} style={visual ? { backgroundImage: `url('${visual.image}')`, backgroundPosition: visual.position } : undefined} role="img" aria-label={`Imagem representativa de ${procedure.name}`}></div><h3>{procedure.name}</h3><p>{procedure.description}</p><WhatsAppLink label="Contato" treatment={procedure.name} className="procedure-contact" /></article>; })}</div>
        <div className="treatments-cta" data-reveal><p>Quer entender qual cuidado combina com a sua necessidade?</p><WhatsAppLink label="Solicitar orçamento pelo WhatsApp" /></div>
      </section>

      <section className="results" aria-labelledby="resultados-title" data-reveal>
        <div className="results-heading"><p className="eyebrow dark"><span></span> Resultados</p><h2 id="resultados-title">Sorrisos que contam novas histórias.</h2><p>Conheça alguns resultados odontológicos compartilhados pela clínica. Cada tratamento é individual: as respostas variam e as imagens não representam promessa de resultado.</p></div>
        <div className="results-marquee" tabIndex={0} aria-label="Carrossel automático de resultados odontológicos; passe o mouse ou use o foco para pausar">
          <div className="results-track">{[0,1].map(loop => <div className="results-set" key={loop} aria-hidden={loop === 1}>{[0,1,2,3].map((index) => <figure className="result-card" key={`${loop}-${index}`}><div className={`result-image result-image-${index}`} role="img" aria-label={loop === 0 ? `Comparativo odontológico demonstrativo ${index + 1}` : undefined}></div></figure>)}</div>)}</div>
        </div>
        <p className="results-note">O carrossel pausa ao receber foco ou ao passar o mouse.</p>
      </section>

      <section className="section faq" id="duvidas" data-reveal>
        <div className="section-heading"><p className="eyebrow dark"><span></span> Dúvidas frequentes</p><h2>Informação clara antes do primeiro contato.</h2></div>
        <div className="faq-list">{config.faqs.map((faq, i) => <details key={faq.question} data-reveal><summary><span>{String(i + 1).padStart(2, "0")}</span>{faq.question}<i aria-hidden="true">+</i></summary><p>{faq.answer}</p></details>)}</div>
      </section>

      <section className="section contact" id="contato" data-reveal>
        <div className="contact-copy"><p className="eyebrow"><span></span> Vamos conversar?</p><h2>O próximo passo começa com uma mensagem.</h2><p>Este site não possui formulário nem armazena sua solicitação. Ao escolher o WhatsApp, a conversa acontece diretamente no aplicativo.</p><WhatsAppLink label="Iniciar conversa no WhatsApp" /><small>Clicar não reserva horário. A equipe confirmará o atendimento pelo aplicativo.</small></div>
        <div className="contact-card"><div><span>Endereço</span><strong>{config.clinic.address}</strong><small>{config.clinic.neighborhood} · {config.clinic.city} · CEP {config.clinic.postalCode}</small></div><div><span>Atendimento</span><strong>{config.clinic.hours}</strong></div><div><span>Contato</span>{getTelephoneUrl() ? <a href={getTelephoneUrl() ?? undefined}><strong>{config.clinic.phoneDisplay}</strong></a> : <strong>{config.clinic.phoneDisplay}</strong>}{config.clinic.email.startsWith("[") ? <small>E-mail ainda não informado</small> : <a href={`mailto:${config.clinic.email}`}><small>{config.clinic.email}</small></a>}</div>{config.clinic.mapUrl ? <a href={config.clinic.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link light">Abrir no mapa ↗</a> : <span className="map-pending">Mapa disponível após configurar o endereço</span>}</div>
      </section>
    </main>

    <footer><div className="footer-main"><a href="#inicio" className="footer-logo"><img src="/logo-jr.png" width="120" height="120" alt="Jr Odontologia" loading="lazy" /></a><div><span>Navegação</span>{nav.slice(0, 4).map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div><div><span>Informações</span><a href="/privacidade">Política de Privacidade</a><a href="/cookies">Política de Cookies</a><a href="/termos">Termos de Uso</a><p>{config.clinic.technicalLead}</p></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} {config.clinic.name}. Todos os direitos reservados.</p><p>Conteúdo sujeito à revisão do responsável técnico antes da publicação.</p></div></footer>
    <WhatsAppLink label="WhatsApp" className="floating-whatsapp" />
  </>;
}
