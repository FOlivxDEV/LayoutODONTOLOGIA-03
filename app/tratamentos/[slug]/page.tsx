import { notFound } from "next/navigation";
import { getWhatsAppUrl, siteConfig } from "../../site-config";

const icons = ["🦷", "✦", "◉", "⌁", "◇", "☼", "✓", "♢", "◎", "✧", "◌", "☆", "◈", "△"] as const;

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

  return <main className="treatment-detail">
    <a className="back-link" href="/#tratamentos">← Voltar aos tratamentos</a>
    <article>
      <span className="procedure-icon" aria-hidden="true">{treatment.icon}</span>
      <p className="doctor-name">TRATAMENTO ODONTOLÓGICO</p>
      <h1>{treatment.name}</h1>
      <p>{treatment.description}</p>
      <p>A indicação depende de avaliação clínica individual. Durante a consulta, a equipe explica as possibilidades, os cuidados necessários e o planejamento adequado para cada caso.</p>
      {whatsapp && <a className="button primary" href={whatsapp} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp ↗</a>}
    </article>
  </main>;
}
