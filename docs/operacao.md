# Operação do site

## Trocar as fotos da vitrine

Pelo painel em `/admin`. As fotos são exibidas em 4:5, então envie já nessa proporção ou aceite que
uma foto vertical de celular (9:16) perde cerca de 30% da altura no corte, normalmente cortando
justo o par.

Para preparar uma foto na mão:

```bash
ffmpeg -i foto-original.jpg \
  -vf "crop=iw:iw*1.25:0:(ih-iw*1.25)*0.5,scale=600:750" -q:v 6 saida.jpg
```

O `0.5` no fim é a posição vertical do recorte. Se o tênis estiver na parte de baixo do
enquadramento, use `0.78`.

## Trocar um vídeo

Os vídeos originais eram gravações de tela do Instagram, com a interface do app no rodapé. O
`crop` remove essa faixa. Mantenha a faixa de áudio: o site tem controle de som.

```bash
ffmpeg -ss <segundo_inicial> -i entrada.mov -t <duracao> \
  -vf "crop=in_w:in_h-150:0:0,scale=540:-2,fps=30" \
  -c:v libx264 -crf 31 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 96k -ac 1 -movflags +faststart public/assets/loja.mp4
```

Escolha um trecho sem as legendas do reels, senão elas aparecem por baixo do texto do site.

O vídeo sempre começa mudo: todo navegador bloqueia autoplay com áudio, e o botão de som no canto
é o gesto que libera. Não existe forma de tocar som automaticamente.

## Mudar horário de funcionamento

Um lugar só: `SEMANA_DA_LOJA`, em `src/core/horario/semana-da-loja.ts`. O selo do topo, a tabela e
os dados estruturados para o Google leem todos dela.

Nunca escreva horário direto no JSX. Já aconteceu de um texto fixo dizer "seg a sáb" enquanto a
tabela logo abaixo mostrava a loja aberta no domingo.

Depois de mexer, rode `npm test`.

## Publicar

O deploy é automático a cada push na `main`, via Cloudflare Pages.

O plano gratuito da Vercel proíbe uso comercial e o site pode ser derrubado sem aviso, por isso a
hospedagem é na Cloudflare, cujo free tier permite uso comercial.
