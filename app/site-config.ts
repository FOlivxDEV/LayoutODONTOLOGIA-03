export type Procedure = { name: string; description: string };
export type TreatmentCategory = { name: string; description: string; image: "procedimentos" | "estetica"; procedures: readonly Procedure[] };
export type Professional = { name: string; specialty: string; cro: string; bio: string; highlights?: readonly string[]; photo?: string };

export const siteConfig = {
  clinic: {
    name: "Jr Odontologia", legalName: "Jr Odontologia", tagline: "Cuidado que acolhe. Odontologia que transforma.",
    phoneDisplay: "+55 13 99187-9892", whatsapp: "5513991879892", email: "[E-MAIL A INFORMAR]",
    address: "Rua Bahia, 21", postalCode: "11.510-070", city: "Cubatão/SP", neighborhood: "Centro",
    mapUrl: "https://maps.app.goo.gl/YpEE6DTwTAhgpTGV9",
    hours: "Particular: seg., ter., qui. e sex., 09h às 18h\nConvênios: qua., 09h às 18h; sáb., 09h às 12h",
    instagram: "https://www.instagram.com/_jrodontologia/", instagramHandle: "@_jrodontologia",
    technicalLead: "[INFORMAR RESPONSÁVEL TÉCNICO E CRO]",
  },
  whatsapp: {
    defaultMessage: "Olá! Acessei o site da Jr Odontologia e gostaria de solicitar um orçamento odontológico.",
    treatmentMessage: (treatment: string) => `Olá! Encontrei no site informações sobre ${treatment} e gostaria de solicitar um orçamento.`,
  },
  seo: {
    title: "Jr Odontologia | Clínica odontológica em Cubatão",
    description: "Tratamentos odontológicos e estética do sorriso no Centro de Cubatão. Conheça a Jr Odontologia e fale com a equipe pelo WhatsApp.",
    canonicalUrl: "https://jr-odontologia.konektplus-dev.chatgpt.site",
  },
  insurances: ["MetLife", "Porto Seguro", "Interodonto", "IMPAO", "AESP", "Santa Casa", "Dimay"],
  treatmentCategories: [
    { name: "Procedimentos odontológicos", description: "Cuidados para prevenção, restauração, reabilitação e alinhamento do sorriso.", image: "procedimentos", procedures: [
      { name: "Implante dentário", description: "Alternativa para substituir dentes ausentes, indicada após avaliação individual." },
      { name: "Coroa dentária", description: "Restauração protética planejada para recuperar proteção, forma e função do dente." },
      { name: "Canal (tratamento endodôntico)", description: "Tratamento do interior do dente para preservar a estrutura sempre que indicado." },
      { name: "Prótese dentária", description: "Soluções personalizadas para recuperar função, conforto e harmonia do sorriso." },
      { name: "Restauração", description: "Reconstrução de áreas comprometidas do dente após avaliação clínica." },
      { name: "Extração dentária", description: "Remoção do dente quando clinicamente indicada, com planejamento e orientação profissional." },
      { name: "Limpeza e raspagem", description: "Cuidados profissionais para prevenção e manutenção da saúde bucal e gengival." },
      { name: "Periodontia (tratamento de gengiva)", description: "Prevenção, diagnóstico e cuidado das estruturas que sustentam os dentes, conforme avaliação periodontal." },
    ]},
    { name: "Estética do sorriso", description: "Opções para cor, forma e acabamento do sorriso, sempre com planejamento clínico.", image: "estetica", procedures: [
      { name: "Facetas", description: "Tratamentos estéticos personalizados com opções em resina, porcelana e lentes de contato, definidos conforme avaliação e planejamento clínico." },
      { name: "Clareamento dental", description: "Opções de clareamento definidas de acordo com a avaliação e a saúde bucal." },
      { name: "Aparelho estético (ortodontia)", description: "Planejamento ortodôntico com alternativas discretas para alinhamento dos dentes." },
    ]},
  ] satisfies TreatmentCategory[],
  professionals: [
    { name: "Dr. Marcos Higa", specialty: "Cirurgião-dentista", cro: "CRO 75.326", bio: "Atendimento experiente, próximo e voltado ao cuidado integral do sorriso.", highlights: ["25 anos de experiência", "Referência na Baixada Santista", "Extração, implante e ortodontia", "Cuidado odontológico completo"], photo: "/dr-marcos-photo-v2.webp" },
    { name: "Dr. José Renato P. Melo", specialty: "Cirurgião-dentista", cro: "CRO 110061", bio: "Atua na equipe da Jr Odontologia com atendimento integrado e planejamento individualizado." },
    { name: "Dr. José Roberto P. Melo", specialty: "Cirurgião-dentista", cro: "CRO 110060", bio: "Atua na equipe da Jr Odontologia com cuidado próximo e atenção às necessidades de cada paciente." },
  ] satisfies Professional[],
  faqs: [
    { question: "Como solicitar um atendimento?", answer: "Use um dos botões de WhatsApp deste site. A equipe continuará o atendimento e confirmará a disponibilidade diretamente pelo aplicativo." },
    { question: "A clínica atende convênios?", answer: "Sim. Atendemos INPAO, Porto Seguro e Servdonto. Confirme a cobertura do seu plano com a equipe antes do atendimento." },
    { question: "Quais são as formas de pagamento?", answer: "Aceitamos dinheiro, PIX, cartão de crédito e cartão de débito." },
    { question: "Há atendimento de urgência?", answer: "Sim, conforme a disponibilidade da agenda. Entre em contato pelo WhatsApp para confirmar o atendimento." },
    { question: "Onde fica a clínica?", answer: "Estamos na Rua Bahia, 21, Centro, Cubatão/SP, CEP 11.510-070, acima do Centro Médico Popular e na esquina com a Praça Princesa Isabel." },
    { question: "Existe estacionamento?", answer: "Não temos estacionamento próprio. Há vagas disponíveis na rua e no entorno da praça." },
    { question: "Qual é o horário de atendimento?", answer: "Particular: segunda, terça, quinta e sexta, das 09h às 18h. Convênios: quarta, das 09h às 18h, e sábado, das 09h às 12h." },
  ],
} as const;

export function getWhatsAppUrl(message?: string) {
  const number = siteConfig.clinic.whatsapp.replace(/\D/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message ?? siteConfig.whatsapp.defaultMessage)}`;
}

export function getTelephoneUrl() {
  const number = siteConfig.clinic.whatsapp.replace(/\D/g, "");
  return number ? `tel:+${number}` : null;
}
