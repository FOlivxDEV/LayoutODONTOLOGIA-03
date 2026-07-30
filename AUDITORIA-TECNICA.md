# Auditoria técnica — Rafael Menezes Odontologia

Data inicial: 22 de julho de 2026  
Escopo: código versionado do site institucional, configuração de build e implantação.  
Estado auditado: branch `security-audit-20260722`, criada a partir do ponto de restauração `backup-pre-security-audit-20260722`.

## Resumo executivo inicial

O projeto é um site institucional em Next.js 16, React 19 e TypeScript, compilado por vinext/Vite para Cloudflare Workers. Não existem formulários, API de contato, banco ativo, autenticação, área administrativa, uploads, CRM, envio de e-mail, cookies não essenciais ou analytics. O contato ocorre por links externos para WhatsApp. Portanto, controles de formulário, rate limit, CAPTCHA, banco e RLS não são aplicáveis nesta versão e não devem ser adicionados sem uma necessidade funcional aprovada.

Foram identificados riscos relevantes em dependências transitivas, tipagem do Worker, conteúdo profissional pendente, comprovação de autorização/licença das imagens, completude legal e estados de erro. Não foram encontrados segredos no código auditado, `dangerouslySetInnerHTML`, formulários simulados, inserção direta em banco ou credenciais administrativas no navegador.

## Segurança

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Alto | `pnpm-lock.yaml` / `next > sharp` | Auditoria encontrou `sharp <0.35.0`, afetado por vulnerabilidades herdadas do libvips. Imagens processadas por versões vulneráveis podem ampliar a superfície de ataque. | Atualizar dependências compatíveis e confirmar nova auditoria sem vulnerabilidades altas. | Pendente | Não |
| Médio | `pnpm-lock.yaml` / `next > postcss` | `postcss <8.5.10` possui falha de escape em serialização CSS. O projeto não aceita CSS de usuários, reduzindo a explorabilidade, mas a dependência deve ser corrigida. | Atualizar de forma compatível e auditar novamente. | Pendente | Não |
| Médio | `worker/index.ts` | CSP permite `unsafe-inline` em scripts e estilos. O build atual de Next/vinext pode depender de conteúdo inline; remoção sem teste quebraria hidratação/estilos. | Manter temporariamente, documentar a exceção e avaliar nonce/hash em uma evolução do runtime. | Pendente documentar | Não; depende do runtime |
| Médio | `worker/index.ts` | Ausência de HSTS, COOP e CORP. Reduz defesa em profundidade contra downgrade e isolamento de contexto. | Adicionar cabeçalhos compatíveis com produção e testar links externos. | Pendente | Não |
| Baixo | Todo o código | Busca não encontrou segredos, chaves, tokens, URLs HTTP, HTML inseguro ou execução de entrada do usuário. | Manter verificação automatizada e `.env*` ignorado. | Conforme | Não |

## Privacidade

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Médio | Página inicial | O texto “Nenhum dado é coletado neste site” é absoluto e contradiz os registros técnicos informados na Política de Privacidade. | Esclarecer que não existe formulário nem armazenamento próprio, sem negar logs técnicos da hospedagem. | Pendente | Não |
| Médio | `app/privacidade/page.tsx` | Política correta para a arquitetura atual, porém sem identificação confirmada do controlador, canal real, retenção de logs ou marcação explícita de modelo jurídico. | Completar quando a clínica fornecer e marcar revisão humana obrigatória. | Pendente | Sim; clínica e hospedagem |
| Informativo | Site | Sem cookies não essenciais ou analytics; banner de consentimento não é necessário nesta versão. | Não instalar banner ou rastreadores sem necessidade. | Conforme | Não |

## Formulários

Não existem formulários, campos, submissões ou sucessos simulados. Validação, antispam, rate limit e CAPTCHA não são aplicáveis. Qualquer formulário futuro exige nova revisão antes da implementação.

## Banco de dados

`.openai/hosting.json` não declara D1/R2 e não há migrations ativas. Diretórios vazios de exemplos não integram o build. Não existe armazenamento de contatos ou dados pessoais. Não criar banco nesta versão.

## Autenticação

Não há login, sessão, cadastro ou área administrativa. Controles de autenticação e autorização não são aplicáveis.

## Uploads

Não há upload. As imagens são arquivos estáticos versionados. Upload clínico futuro deve usar armazenamento privado e controle de acesso.

## Integrações

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Baixo | `app/site-config.ts` / WhatsApp | Número e mensagens estão centralizados, normalizados e codificados. Links usam `noopener noreferrer`; não incluem dados do visitante. | Ajustar mensagem inicial para texto ainda mais genérico e manter testes. | Pendente | Não |
| Baixo | Contato | Telefone é exibido, mas não existe link `tel:`. Usuários móveis não conseguem iniciar ligação diretamente. | Criar URL telefônica centralizada e link acessível. | Pendente | Não |
| Informativo | Maps / Instagram | Integrações são links externos sob demanda; nenhum iframe ou script de terceiro é carregado. | Manter este modelo de privacidade e desempenho. | Conforme | Não |
| Informativo | CRM / e-mail | Não existem integrações. Não criar provedores fictícios sem credenciais e necessidade aprovada. | Documentar como desativado. | Conforme | Sim, se desejado no futuro |

## Performance

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Médio | `public/*.png` | Várias imagens pesam entre 1,4 MB e 2,2 MB; o total aumenta LCP, consumo móvel e tempo de download. | Converter cópias usadas para WebP mantendo dimensões/qualidade visual e lazy loading fora da dobra. | Pendente | Confirmar licença, não conteúdo |
| Baixo | `SiteShell.tsx` | Todo o shell é cliente por causa dos carrosséis/menu; aumenta JavaScript, embora o volume seja pequeno e não haja bibliotecas extras. | Preservar por ora; separar ilhas apenas se medição justificar. | Aceito | Não |

## SEO

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Médio | Páginas legais | Política e Termos herdam o mesmo título/descrição da página inicial. | Adicionar metadados próprios. | Pendente | Não |
| Médio | Site | Não há dados estruturados de clínica/dentista. | Adicionar JSON-LD apenas com nome, endereço, telefone e URL confirmados; sem avaliações ou alegações. | Pendente | Confirmar responsável técnico |
| Baixo | `sitemap.ts` | `lastModified` muda a cada geração, mesmo sem alteração real. | Remover data artificial ou usar data editorial estável. | Pendente | Não |
| Informativo | `robots.ts`, canonical, OG | Robots, sitemap, canonical, Open Graph e idioma estão implementados. | Manter. | Conforme | Confirmar domínio final |

## Acessibilidade

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Médio | Menu móvel | Escape fecha o menu, mas não há movimentação/retorno de foco. | Focar o primeiro link ao abrir e devolver foco ao botão ao fechar. | Pendente | Não |
| Médio | Carrosséis | Equipe e clínica avançam automaticamente sem pausa explícita por foco/hover e sem anúncio controlado do slide. | Pausar em foco/hover e oferecer estado acessível sem anúncios excessivos. | Pendente | Não |
| Baixo | Accordions | `<details>/<summary>` oferece semântica nativa e teclado; layout móvel mantém área de toque. | Manter e ampliar testes. | Conforme | Não |
| Informativo | Geral | Skip link, foco visível, `prefers-reduced-motion`, idioma e nomes acessíveis existem. | Manter. | Conforme | Não |

## Código

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Alto | `worker/index.ts` / TypeScript | Typecheck falha porque `Fetcher` e `D1Database` não estão definidos; `DB` nem é utilizado. Isso impede validação rigorosa. | Remover binding inexistente e declarar contrato mínimo do asset fetcher. | Pendente | Não |
| Médio | Aplicação | Não existem `not-found.tsx`, `error.tsx` ou `loading.tsx`. Falhas podem usar telas genéricas e pouco claras. | Criar estados seguros usando estilos existentes. | Pendente | Não |
| Baixo | `package.json` | Não há script explícito de typecheck ou verificação agregada. | Adicionar `typecheck` e `verify`. | Pendente | Não |

## Dependências

Auditoria inicial: 1 vulnerabilidade alta (`sharp`) e 1 moderada (`postcss`). Existem atualizações patch para Next/React e várias atualizações maiores não necessárias. Atualizações maiores não serão aplicadas automaticamente.

## Implantação

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Médio | Domínio | O site usa domínio de desenvolvimento do Sites, não domínio oficial da clínica. | Configurar domínio aprovado, DNS e HTTPS antes da divulgação definitiva. | Pendente | Sim |
| Baixo | Recuperação | O Git possui histórico, mas não havia ponto específico para esta auditoria. | Criado tag e branch separados antes das mudanças. | Corrigido | Não |

## Conteúdo

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Alto | Equipe / rodapé | CRO do Dr. Marcos e responsável técnico continuam como placeholders. Publicação profissional incompleta pode gerar risco regulatório. | Fornecer e validar dados oficiais antes da publicação final. | Pendente | Sim; responsável técnico |
| Médio | Contato | E-mail real não foi fornecido; placeholder aparece no site e na política. | Ocultar como link/contato até receber endereço real e manter pendência documentada. | Pendente | Sim |
| Alto | Resultados | Imagens de resultados precisam de autorização documentada, comprovação de origem e aprovação do responsável técnico. | Não ampliar uso; obter documentação e revisar publicidade odontológica. | Pendente | Sim |
| Médio | Imagens ilustrativas | Licenças e autorização de uso de imagens/logotipo não estão documentadas no repositório. | Criar inventário e obter comprovantes. | Pendente | Sim |

## Conformidade

| Severidade | Parte afetada | Problema, risco e impacto | Solução recomendada | Status | Externo / decisão clínica |
|---|---|---|---|---|---|
| Alto | Publicidade odontológica | CRO/RT incompletos e resultados sem documentação de autorização exigem revisão humana. | Bloquear aprovação editorial definitiva até revisão do responsável técnico. | Pendente | Sim |
| Médio | Textos de experiência/referência | “+20 anos” e “referência na Baixada Santista” são alegações fornecidas pelo solicitante, mas sem comprovação no repositório. | Manter visualmente, sinalizar para comprovação e aprovação clínica. | Pendente | Sim |

## Pendências prioritárias

1. Corrigir vulnerabilidades alta/moderada e repetir auditoria.
2. Fazer o typecheck passar.
3. Reforçar headers sem quebrar o runtime.
4. Criar estados de erro/404/carregamento e metadados legais.
5. Melhorar foco do menu e pausa dos carrosséis.
6. Otimizar imagens usadas sem alteração perceptível.
7. Atualizar documentação operacional, segurança e publicação.
8. Obter CRO/RT, e-mail, autorizações/licenças e domínio oficial da clínica.

## Resultado após correções

Validação concluída em 22 de julho de 2026:

- **Corrigido:** dependências Next/React atualizadas em versões patch compatíveis; `sharp` e `postcss` substituídos por versões corrigidas. `pnpm audit --prod`: nenhuma vulnerabilidade conhecida.
- **Corrigido:** lint, typecheck, testes automatizados e build de produção passam pelo comando `pnpm verify`.
- **Corrigido:** Worker tipado sem binding de banco inexistente; HSTS, COOP, CORP, CSP reforçada, `X-Content-Type-Options`, política de referenciador, proteção contra frames e política de permissões presentes.
- **Risco residual aceito:** `unsafe-inline` permanece na CSP por compatibilidade do Next.js/vinext. A exceção está documentada em `SECURITY.md` e deve ser revista quando o runtime suportar nonces/hashes estáveis.
- **Corrigido:** texto de contato não nega logs técnicos; políticas de Privacidade e Cookies refletem a arquitetura real e não exibem banner sem cookies não essenciais.
- **Corrigido:** telefone clicável, mensagem do WhatsApp centralizada e codificada, links externos protegidos.
- **Corrigido:** metadados legais únicos, JSON-LD sem avaliações inventadas, sitemap estável e rota de cookies incluída.
- **Corrigido:** menu móvel movimenta e devolve foco; carrosséis pausam em foco/hover e respeitam movimento reduzido.
- **Corrigido:** páginas seguras de carregamento, erro e 404; scripts agregados de verificação e documentação operacional adicionados.
- **Melhorado:** principais fotografias ganharam cópias WebP, reduzindo os arquivos usados de destaque em mais de 90% sem alterar dimensões.
- **Atualizado:** a integração de conteúdo remoto foi removida. Todo o conteúdo institucional é carregado localmente de `app/site-config.ts`, sem banco de dados ou backend.

## Pendências externas após a auditoria

1. Manter visível que o CRO e os dados do responsável técnico são demonstrativos.
2. Fornecer e-mail real do controlador/contato de privacidade.
3. Documentar licenças e autorizações de todas as imagens, especialmente resultados de pacientes.
4. Substituir imagens ilustrativas e fotos pendentes quando os arquivos autorizados forem fornecidos.
5. Confirmar domínio e hospedagem definitivos e revisar as políticas com responsável técnico/jurídico.

Esses itens permanecem deliberadamente pendentes e não foram apresentados como resolvidos.
