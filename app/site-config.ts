export type Procedure = { name: string; description: string };
export type TreatmentCategory = { name: string; description: string; image: "procedimentos" | "estetica"; procedures: readonly Procedure[] };
export type Professional = { name: string; specialty: string; cro: string; bio: string; highlights?: readonly string[]; photo?: string };

export const siteConfig = {
  clinic: {
    name: "Rafael Menezes Odontologia", legalName: "Rafael Menezes Odontologia", tagline: "Precisão no cuidado. Leveza em cada sorriso.",
    phoneDisplay: "+55 11 90000-4827", whatsapp: "5511900004827", email: "contato@rafaelmenezesodontologia.example",
    address: "Alameda Horizonte, 248", postalCode: "00000-000", city: "São Paulo/SP", neighborhood: "Jardim Aurora",
    mapUrl: "#clinica",
    hours: "Segunda a sexta, das 08h às 19h\nSábado, das 08h às 13h",
    instagram: "#contato", instagramHandle: "@rafaelmenezes.odontologia",
    technicalLead: "Dr. Rafael Menezes · CRO-SP 00000 · Dados demonstrativos",
  },
  whatsapp: {
    defaultMessage: "Olá! Acessei o site da Rafael Menezes Odontologia e gostaria de solicitar um atendimento.",
    treatmentMessage: (treatment: string) => `Olá! Encontrei no site informações sobre ${treatment} e gostaria de solicitar um orçamento.`,
  },
  seo: {
    title: "Rafael Menezes Odontologia | Cuidado e precisão",
    description: "Clínica odontológica fictícia do Dr. Rafael Menezes, criada para apresentar uma experiência de cuidado próxima, moderna e personalizada.",
    canonicalUrl: "https://rafael-menezes-odontologia.vercel.app",
  },
  insurances: ["Sorriso Mais", "Dental Vida", "BemEstar Odonto", "Plano Aurora"],
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
    { name: "Dr. Rafael Menezes", specialty: "Cirurgião-dentista fictício", cro: "CRO-SP 00000", bio: "Profissional fictício criado para representar um atendimento acolhedor, transparente e personalizado.", highlights: ["Planejamento individualizado", "Tecnologia e conforto", "Comunicação clara", "Cuidado integral do sorriso"], photo: "/professional-fictional-layout3.png" },
  ] satisfies Professional[],
  faqs: [
    { question: "Como solicitar um atendimento?", answer: "Use um dos botões de WhatsApp deste site. A equipe continuará o atendimento e confirmará a disponibilidade diretamente pelo aplicativo." },
    { question: "A clínica atende convênios?", answer: "Para fins deste layout demonstrativo, a clínica trabalha com planos fictícios. A cobertura deve ser confirmada diretamente com a equipe." },
    { question: "Quais são as formas de pagamento?", answer: "Aceitamos dinheiro, PIX, cartão de crédito e cartão de débito." },
    { question: "Há atendimento de urgência?", answer: "Sim, conforme a disponibilidade da agenda. Entre em contato pelo WhatsApp para confirmar o atendimento." },
    { question: "Onde fica a clínica?", answer: "O endereço exibido neste projeto é fictício: Alameda Horizonte, 248, Jardim Aurora, São Paulo/SP." },
    { question: "Existe estacionamento?", answer: "Neste cenário fictício, há estacionamento conveniado próximo à clínica." },
    { question: "Qual é o horário de atendimento?", answer: "Segunda a sexta, das 08h às 19h, e sábado, das 08h às 13h." },
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
