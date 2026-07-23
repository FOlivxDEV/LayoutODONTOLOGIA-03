# Jr Odontologia

Site institucional responsivo da Jr Odontologia, construído com Next.js 16, React 19, TypeScript, vinext/Vite e Cloudflare Workers. Não possui backend funcional, banco de dados, cadastro, agenda interna ou formulário; o contato é encaminhado ao WhatsApp.

## Executar

Requer Node.js 22.13+ e pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Verificação completa:

```bash
pnpm verify
pnpm audit --prod
```

## Configuração de conteúdo

Telefone, endereço, horários, profissionais, tratamentos, convênios, perguntas, links e SEO ficam centralizados em `app/site-config.ts`. Não espalhe dados de contato pelos componentes.

As imagens públicas ficam em `public/`. Antes de substituir arquivos, confirme licença, autorização de uso e dimensões adequadas. Imagens de pacientes exigem autorização documentada.

## Segurança e privacidade

Os cabeçalhos são definidos em `worker/index.ts`. O projeto não precisa de variáveis de ambiente nesta versão. Não adicione chaves privadas ao navegador ou ao Git. Consulte `SECURITY.md`, `AUDITORIA-TECNICA.md` e `CHECKLIST-PUBLICACAO.md`.

Não há banner de cookies porque não existem ferramentas não essenciais ativas. Se analytics, marketing, formulários ou banco forem introduzidos, faça uma nova revisão LGPD antes de publicar.

## Conteúdo local

Todo o conteúdo institucional é mantido em `app/site-config.ts`. Esta versão não usa banco de dados, API de conteúdo ou serviço externo de persistência.

## Publicação

O projeto contém `.openai/hosting.json` e é publicado pelo Sites/Cloudflare. Execute o checklist, gere o build e valide a URL publicada antes de divulgar. O código também pode ser versionado no GitHub, sem arquivos de ambiente ou segredos.
