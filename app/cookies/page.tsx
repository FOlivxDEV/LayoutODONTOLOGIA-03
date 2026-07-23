import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies | Jr Odontologia",
  description: "Informações sobre cookies e recursos de terceiros no site institucional da Jr Odontologia.",
};

export default function Cookies() {
  return <main className="legal-page">
    <Link href="/" className="back-link">← Voltar ao site</Link>
    <p className="eyebrow dark"><span></span> Escolhas de privacidade</p>
    <h1>Política de Cookies</h1>
    <p className="updated">Última atualização: 22 de julho de 2026.</p>
    <section>
      <h2>Uso atual</h2><p>Esta versão do site não instala cookies de analytics, publicidade ou personalização e não carrega pixels de marketing. Por isso, não exibimos um banner de consentimento desnecessário.</p>
      <h2>Funcionamento e hospedagem</h2><p>A infraestrutura de hospedagem pode usar mecanismos estritamente necessários para segurança, entrega do conteúdo e prevenção de abuso. Esses mecanismos não são usados pela clínica para criar perfis publicitários.</p>
      <h2>Serviços externos</h2><p>WhatsApp, Google Maps e Instagram são abertos somente depois de uma ação do visitante. A partir desse momento, o serviço externo poderá aplicar suas próprias tecnologias e políticas.</p>
      <h2>Mudanças futuras</h2><p>Se ferramentas não essenciais forem adicionadas, esta política será atualizada e, quando exigido, o carregamento ocorrerá apenas após uma escolha válida do visitante.</p>
    </section>
  </main>;
}
