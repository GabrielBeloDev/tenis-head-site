# Tênis Head

Site e painel de gestão de uma loja de tênis real em São Luís — MA, que vende no varejo e no
atacado e fecha todas as vendas pelo WhatsApp.

**[tenis-head-site.gabrielbelodev.workers.dev](https://tenis-head-site.gabrielbelodev.workers.dev)** · Next.js 16 · React 19 · TypeScript · Tailwind 4 · Supabase

<!-- prints entram aqui -->

## O problema

A loja tinha Instagram e uma ficha no Google Maps preenchida por terceiros, com o número errado.
Quem procurava no Google não achava horário, endereço confiável nem um jeito rápido de falar com
alguém. E, como toda venda acontece no WhatsApp, qualquer atrito antes da conversa é venda perdida.

O site precisava resolver três coisas: existir na busca local, responder as perguntas que o cliente
faz antes de comprar (abre agora? onde fica? como funciona?), e levar para o WhatsApp em um toque.
Além disso, o dono precisava trocar as fotos da vitrine sozinho, sem depender de mim.

## Decisões

### O domínio não conhece o framework

`src/core` não importa nada de Next nem de Supabase. Só entidades, portas e casos de uso.

```
src/
  core/      regra de negócio pura — não sabe que existe HTTP, React ou banco
  infra/     adaptadores que implementam as portas do core
  ui/        componentes de apresentação
  app/       rotas do Next
```

O ganho concreto aparece nos testes: a regra de horário roda em milissegundos, sem subir
aplicação nem banco. E a home funciona com o repositório em memória enquanto o Supabase não
estiver configurado, porque quem consome depende da porta, não da implementação.

### Horário é regra de negócio, não formatação

O site mostra "Aberto agora · fecha às 19:30" em tempo real. Parece detalhe, mas concentra as
regras chatas: dois turnos por dia, terça abrindo 14:00 enquanto os outros dias abrem 14:30,
domingo só de manhã, e a virada de meia-noite.

O cálculo é sempre feito no fuso da loja (`America/Fortaleza`), nunca no de quem visita. Sem isso,
alguém abrindo o site de Portugal veria "aberto agora" às 3 da manhã.

São 21 testes, entre eles uma varredura dos **10.080 minutos da semana** comparando o resultado
com um modelo independente. Foi assim que apareceu o bug que estava no ar: um texto fixo dizia
"seg a sáb" enquanto a loja abre domingo de manhã.

### Estático por padrão, dinâmico só onde precisa

A home inteira é pré-renderizada. O único JavaScript que roda no cliente é o do selo de horário, a
tabela e o controle de som dos vídeos. O painel fica atrás de auth e fora do índice de busca.

### Peso importa mais que stack

O público acessa por celular, muitas vezes em 4G. As fotos são recortadas no upload na mesma
proporção em que o card as exibe, para não trafegar pixel que nunca é pintado, e os vídeos foram
reduzidos de 174 MB para 2,5 MB. O primeiro carregamento é de cerca de 1,2 MB.

### O painel evita custo em vez de escalar

Uma loja de bairro tem dezenas de fotos, não milhares. O recorte para 600×750 acontece no
navegador, antes do upload: uma foto de celular de 4 MB vira cerca de 60 KB, e o que sobe é
exatamente o que o card desenha. Com isso 40 produtos ocupam poucos megabytes e o free tier do
Supabase (1 GB) nunca é atingido.

A escolha foi deliberada: manter o custo mensal em zero para o dono, que já paga o domínio.

## Rodar

```bash
nvm use            # Node 22
npm install
npm run dev
```

Publicar:

```bash
npm run cf:build && npx wrangler deploy
```

O site sobe sem nenhuma configuração, usando a vitrine inicial do código. Para habilitar o painel,
copie `.env.example` para `.env.local`, preencha com as chaves do seu projeto Supabase e rode
`supabase/schema.sql` no SQL Editor.

```bash
npm test           # 21 testes da regra de negócio
npm run typecheck  # TypeScript estrito, sem any
npm run build
```

## Documentação

- [Operação do site](docs/operacao.md) — trocar fotos, encodar vídeos, editar horários
- [Dados da loja e fontes](docs/dados-da-loja.md) — de onde veio cada informação publicada
