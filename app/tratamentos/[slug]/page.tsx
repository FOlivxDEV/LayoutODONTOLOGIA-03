import { notFound } from "next/navigation";
import { getWhatsAppUrl, siteConfig } from "../../site-config";

const icons = ["🦷", "✦", "◉", "⌁", "◇", "☼", "✓", "♢", "◎", "✧", "◌", "☆", "◈", "△"] as const;

const treatmentImages: Record<string, string> = {
  "implante-dentario": "/procedures/implante-dentario.png",
  "coroa-dentaria": "/procedures/coroa-dentaria.png",
  "canal-tratamento-endodontico": "/procedures/canal.jpg",
  "protese-dentaria": "/procedures/protese-dentaria.jpg",
  "restauracao": "/procedures/restauracao.jpg",
  "extracao-dentaria": "/procedures/extracao-dentaria.jpg",
  "limpeza-e-raspagem": "/procedures/limpeza-raspagem.jpg",
  "periodontia-tratamento-de-gengiva": "/procedures/periodontia.jpg",
  "facetas": "/procedures/faceta-porcelana.png",
  "lentes-de-contato": "/procedures/lentes-contato.jpg",
  "clareamento-dental": "/procedures/clareamento-dental.jpg",
  "faceta-de-resina": "/procedures/faceta-resina.jpg",
  "faceta-de-porcelana": "/procedures/faceta-porcelana.png",
  "aparelho-estetico-ortodontia": "/procedures/aparelho-estetico.png",
};

const nav = [["Início", "/#inicio"], ["Clínica", "/#clinica"], ["Tratamentos", "/#tratamentos"], ["Equipe", "/#equipe"], ["Agendamento", "/#duvidas"], ["Contato", "/#contato"]] as const;

function slugify(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const sourceTreatments = siteConfig.treatmentCategories.flatMap((category) => category.procedures);
const treatments = [
  ...sourceTreatments,
  { name: "Facetas", description: "Tratamentos estéticos personalizados com opções em resina, porcelana e lentes de contato, definidos conforme avaliação e planejamento clínico." },
].map((procedure, index) => ({ ...procedure, slug: slugify(procedure.name), icon: icons[index % icons.length] }));

export function generateStaticParams() {
  return treatments.map((treatment) => ({ slug: treatment.slug }));
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treatment = treatments.find((item) => item.slug === slug);
  if (!treatment) notFound();
  const whatsapp = getWhatsAppUrl(siteConfig.whatsapp.treatmentMessage(treatment.name));
  const image = treatmentImages[treatment.slug] ?? "/clinic-hero.png";

  return <>
    <header className="site-header treatment-page-header">
      <a href="/#inicio" className="brand" aria-label="JR Odontologia — início"><img src="/logo-jr-transparent.png" width="128" height="64" alt="JR Odontologia" /></a>
      <nav className="nav" aria-label="Navegação principal">{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
    </header>
    <main className="treatment-detail">
      <section className="treatment-photo-hero">
        <span className="treatment-photo-backdrop" style={{ backgroundImage: `url('${image}')` }} aria-hidden="true"></span>
        <img src={image} width="1600" height="900" alt={`Imagem representativa de ${treatment.name}`} />
      </section>
      <article>
        <a className="back-link" href="/#tratamentos">← Voltar aos tratamentos</a>
        <p className="doctor-name">TRATAMENTO ODONTOLÓGICO</p>
        <h1>{treatment.name}</h1>
        <p>{treatment.description}</p>
        <p>A indicação depende de avaliação clínica individual. Durante a consulta, a equipe explica as possibilidades, os cuidados necessários e o planejamento adequado para cada caso.</p>
        {whatsapp && <a className="button primary" href={whatsapp} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp ↗</a>}
      </article>
    </main>
    <footer id="contato"><div className="footer-main footer-layout3"><a href="/#inicio" className="footer-logo"><img src="/logo-jr.png" width="150" height="150" alt="JR Odontologia" /></a><div><span>Endereço</span><strong>{siteConfig.clinic.address}</strong><p>{siteConfig.clinic.neighborhood}<br />{siteConfig.clinic.city} · CEP {siteConfig.clinic.postalCode}</p><a href={siteConfig.clinic.mapUrl} target="_blank" rel="noopener noreferrer">Abrir no mapa ↗</a></div><div><span>Contato</span><strong>{siteConfig.clinic.phoneDisplay}</strong><a href={siteConfig.clinic.instagram} target="_blank" rel="noopener noreferrer">{siteConfig.clinic.instagramHandle}</a><p>{siteConfig.clinic.hours}</p></div><div><span>Políticas</span><a href="/privacidade">Política de Privacidade</a><a href="/cookies">Política de Cookies</a><a href="/termos">Termos de Uso</a></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} {siteConfig.clinic.name}. Todos os direitos reservados.</p><p>{siteConfig.clinic.technicalLead}</p></div></footer>
    {whatsapp && <a className="floating-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Falar pelo WhatsApp"><img src="/whatsapp-icon.png" width="58" height="58" alt="" /></a>}
  </>;
}
