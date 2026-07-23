import Link from "next/link";

export default function NotFound() {
  return <main className="legal-page"><p className="eyebrow dark"><span></span> Página não encontrada</p><h1>Este endereço não existe.</h1><p>O conteúdo pode ter mudado de lugar. Volte ao início para continuar navegando com segurança.</p><Link href="/" className="button primary">Voltar ao site</Link></main>;
}
