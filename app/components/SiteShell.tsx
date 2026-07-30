"use client";
/* eslint-disable @next/next/no-img-element -- vinext local image optimizer requires an ASSETS binding unavailable in development; assets are local, dimensioned and deployment-safe. */

import { useEffect, useRef, useState } from "react";
import { getWhatsAppUrl, siteConfig } from "../site-config";
import type { TreatmentCategory } from "../site-config";
import { BrandMark } from "./BrandMark";

const nav = [
  ["Início", "#inicio"], ["Clínica", "#clinica"], ["Tratamentos", "#tratamentos"],
  ["Equipe", "#equipe"], ["Agendamento", "#duvidas"], ["Contato", "#contato"],
] as const;

const heroSlides = [
  { src: "/clinic-hero.png", alt: "Consultório odontológico moderno e acolhedor" },
  { src: "/clinic-office-illustrative.webp", alt: "Sala clínica odontológica iluminada" },
  { src: "/clinic-facade-illustrative.webp", alt: "Fachada ilustrativa da clínica odontológica" },
] as const;

const treatmentIcons = ["🦷", "✦", "◉", "⌁", "◇", "☼", "✓", "♢", "◎", "✧", "◌", "☆", "◈", "△"] as const;

function treatmentSlug(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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
  const [heroSlide, setHeroSlide] = useState(0);
  const [clinicSlide, setClinicSlide] = useState(0);
  const [clinicPaused, setClinicPaused] = useState(false);
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % heroSlides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (clinicPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setClinicSlide((current) => (current + 1) % 2), 3000);
    return () => window.clearInterval(timer);
  }, [clinicPaused]);

  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header ref={headerRef} className={`site-header ${headerScrolled ? "is-scrolled" : ""}`}>
      <a href="#inicio" className="brand" aria-label="Rafael Menezes Odontologia — início">
        <BrandMark />
      </a>
      <nav ref={navRef} id="main-nav" className={menuOpen ? "nav open" : "nav"} aria-label="Navegação principal">
        {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <button ref={menuButtonRef} className="menu-button" aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen(v => !v)}>
        <span></span><span></span><span></span>
      </button>
    </header>

    <main id="conteudo">
      <section className="hero" id="inicio">
        <div className="hero-slides" aria-live="polite">{heroSlides.map((slide, index) => <img key={slide.src} className={index === heroSlide ? "active" : ""} src={slide.src} alt={index === heroSlide ? slide.alt : ""} width="1536" height="1024" fetchPriority={index === 0 ? "high" : undefined} />)}</div>
        <div className="hero-content" data-reveal>
          <p className="hero-kicker">Rafael Menezes Odontologia · Clínica fictícia</p>
          <h1>Excelência que se revela <em>em cada sorriso.</em></h1>
          <p className="hero-copy">Cuidado odontológico completo, tecnologia e atenção próxima para transformar cada consulta em uma experiência tranquila e segura.</p>
          <div className="hero-actions"><WhatsAppLink className="button hero-button" /></div>
          <p className="helper">O atendimento e a confirmação de disponibilidade acontecem pelo WhatsApp.</p>
        </div>
        <div className="hero-indicators" aria-label="Selecionar imagem do destaque">{heroSlides.map((slide, index) => <button key={slide.src} type="button" className={index === heroSlide ? "active" : ""} onClick={() => setHeroSlide(index)} aria-label={`Mostrar imagem ${index + 1}`} aria-current={index === heroSlide ? "true" : undefined}></button>)}</div>
      </section>

      <section className="section clinic-story" id="equipe" aria-labelledby="clinica-story-title">
        <figure className="professional-photo" data-reveal><img src="/professional-fictional-layout3.png" width="1024" height="1280" alt="Retrato ilustrativo de profissional fictício" loading="lazy" /></figure>
        <div className="story-copy" data-reveal><p className="doctor-name">DR. RAFAEL MENEZES</p><h2 id="clinica-story-title">Conhecimento técnico com um olhar verdadeiramente humano.</h2><p>Cirurgião-dentista fictício apresentado exclusivamente para composição deste layout. A proposta representa um atendimento próximo, com explicações claras, planejamento responsável e cuidado adequado à realidade de cada pessoa.</p><WhatsAppLink label="Conhecer a clínica pelo WhatsApp" /></div>
      </section>

      <section className="section place-showcase" id="clinica">
        <div className="place-main" data-reveal><h2>Um espaço pensado<br />para receber bem.</h2><p>A Rafael Menezes Odontologia é uma clínica fictícia criada para este projeto. O endereço, os canais de contato e os horários abaixo são demonstrativos e não correspondem a um estabelecimento real.</p></div>
        <button className="clinic-photo-stack compact" data-reveal type="button" onClick={() => setClinicSlide((current) => (current + 1) % 2)} onMouseEnter={() => setClinicPaused(true)} onMouseLeave={() => setClinicPaused(false)} onFocus={() => setClinicPaused(true)} onBlur={() => setClinicPaused(false)} aria-label="Alternar entre foto ilustrativa da fachada e do consultório"><img className={clinicSlide === 0 ? "active" : ""} src="/clinic-facade-illustrative.webp" width="1024" height="1280" alt="Imagem ilustrativa da fachada de uma clínica odontológica" loading="lazy" /><img className={clinicSlide === 1 ? "active" : ""} src="/clinic-office-illustrative.webp" width="1024" height="1280" alt="Imagem ilustrativa de um consultório odontológico" loading="lazy" /><span>Imagem ilustrativa · toque para alternar</span><i aria-hidden="true">{clinicSlide + 1} / 2</i></button>
        <div className="place-contact" data-reveal><div className="place-grid"><div><span>Endereço fictício</span><strong>{config.clinic.address}</strong><small>{config.clinic.neighborhood} · {config.clinic.city} · CEP {config.clinic.postalCode}</small></div><div><span>Instagram fictício</span><strong>{config.clinic.instagramHandle}</strong><small>Perfil demonstrativo deste layout</small></div><div><span>Telefone fictício</span><strong>{config.clinic.phoneDisplay}</strong><small>Canal demonstrativo para agendamento</small></div><div className="map-preview" aria-label="Representação ilustrativa da localização fictícia"><span className="map-road road-one">Alameda Horizonte</span><span className="map-road road-two">Jardim Aurora</span><i aria-hidden="true"></i><strong>Rafael Menezes<br />Odontologia</strong><small>Localização ilustrativa</small></div></div><div className="place-actions"><WhatsAppLink label="Falar com a clínica" className="button secondary" /></div></div>
      </section>

      <section className="section treatments" id="tratamentos">
        <div className="section-heading split" data-reveal><div><p className="eyebrow"><span></span> Tratamentos</p><h2>Excelência em cuidados odontológicos personalizados.</h2></div><p>Explore os procedimentos odontológicos e de estética do sorriso oferecidos pela equipe. Cada indicação é definida somente após avaliação profissional.</p></div>
        <div className="procedure-card-grid icon-cards" id="treatment-panel" data-reveal>{config.treatmentCategories.flatMap((category) => category.procedures).map((procedure, index) => <a className="procedure-card icon-card" key={procedure.name} href={`/tratamentos/${treatmentSlug(procedure.name)}`} aria-label={`Abrir página sobre ${procedure.name}`}><span className="procedure-icon" aria-hidden="true">{treatmentIcons[index % treatmentIcons.length]}</span><h3>{procedure.name}</h3></a>)}</div>
        <div className="treatments-cta" data-reveal><p>Quer entender qual cuidado combina com a sua necessidade?</p><WhatsAppLink label="Solicitar orçamento pelo WhatsApp" /></div>
      </section>

      <section className="results" aria-labelledby="resultados-title" data-reveal>
        <div className="results-heading"><p className="eyebrow dark"><span></span> Resultados</p><h2 id="resultados-title">Sorrisos que contam novas histórias.</h2><p>Conheça alguns resultados odontológicos compartilhados pela clínica. Cada tratamento é individual: as respostas variam e as imagens não representam promessa de resultado.</p></div>
        <div className="results-marquee" tabIndex={0} aria-label="Carrossel automático de resultados odontológicos; passe o mouse ou use o foco para pausar">
          <div className="results-track">{[0,1].map(loop => <div className="results-set" key={loop} aria-hidden={loop === 1}>{[0,1,2,3].map((index) => <figure className="result-card" key={`${loop}-${index}`}><div className={`result-image result-image-${index}`} role="img" aria-label={loop === 0 ? `Comparativo odontológico demonstrativo ${index + 1}` : undefined}></div></figure>)}</div>)}</div>
        </div>
        <p className="results-note">O carrossel pausa ao receber foco ou ao passar o mouse.</p>
      </section>

      <section className="schedule-banner" id="duvidas" data-reveal>
        <div><h2>Entre em contato e<br />realize seu agendamento</h2><WhatsAppLink label="Realizar agendamento" className="button banner-button" /></div>
      </section>
    </main>

    <footer id="contato"><div className="footer-main footer-layout3"><a href="#inicio" className="footer-logo" aria-label="Rafael Menezes Odontologia — início"><BrandMark compact /></a><div><span>Endereço fictício</span><strong>{config.clinic.address}</strong><p>{config.clinic.neighborhood}<br />{config.clinic.city} · CEP {config.clinic.postalCode}</p><small>Informação demonstrativa</small></div><div><span>Contato fictício</span><strong>{config.clinic.phoneDisplay}</strong><p>{config.clinic.instagramHandle}</p><p>{config.clinic.hours}</p></div><div><span>Políticas</span><a href="/privacidade">Política de Privacidade</a><a href="/cookies">Política de Cookies</a><a href="/termos">Termos de Uso</a></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} {config.clinic.name}. Projeto demonstrativo.</p><p>{config.clinic.technicalLead}</p></div></footer>
    <WhatsAppLink label="WhatsApp" className="floating-whatsapp" />
  </>;
}
