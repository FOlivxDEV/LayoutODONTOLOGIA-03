# Checklist de publicação

## Validação técnica

- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm audit --prod` sem vulnerabilidades relevantes conhecidas
- [ ] `pnpm verify` concluído
- [ ] Navegação, menu móvel, accordions e carrosséis testados por teclado e toque
- [ ] Revisão visual em celular pequeno, celular grande, tablet e desktop
- [ ] Console sem erros e recursos sem falha de carregamento
- [ ] Links de WhatsApp, telefone, Instagram e Google Maps conferidos
- [ ] HTTPS e cabeçalhos de segurança conferidos no ambiente publicado

## Revisão obrigatória da clínica

- [ ] Confirmar que CRO e responsável técnico permaneçam identificados como dados fictícios
- [ ] Confirmar e-mail do controlador/contato de privacidade
- [ ] Substituir imagens ilustrativas da fachada e consultório por fotos autorizadas
- [ ] Adicionar fotos autorizadas dos profissionais sem imagem
- [ ] Documentar autorização e licença das imagens de resultados
- [ ] Validar procedimentos, convênios, horários e regras comerciais
- [ ] Confirmar domínio e provedor definitivos
- [ ] Aprovar Política de Privacidade, Cookies e Termos com responsável técnico/jurídico

## Privacidade

- [ ] Confirmar que não há analytics, pixels ou cookies não essenciais
- [ ] Se houver nova ferramenta, atualizar políticas e implementar consentimento quando necessário
- [ ] Não incluir dados pessoais, clínicos ou conteúdo de mensagens em analytics ou logs
