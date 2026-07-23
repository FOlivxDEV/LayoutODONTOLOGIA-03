"use client";
import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="legal-page"><p className="eyebrow dark"><span></span> Não foi possível carregar</p><h1>Algo saiu do esperado.</h1><p>Nenhum detalhe técnico ou dado sensível é exibido. Tente novamente ou volte à página inicial.</p><button type="button" className="button primary" onClick={reset}>Tentar novamente</button> <Link className="button secondary" href="/">Voltar ao início</Link></main>;
}
