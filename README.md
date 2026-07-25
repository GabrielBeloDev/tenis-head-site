# Tênis Head — site

Site institucional de uma página da **Tênis Head**, loja de atacado e varejo de tênis em
São Luís — MA. HTML, CSS e JavaScript puros, sem build e sem dependências.

No ar em **https://tenis-head-site.vercel.app**

Todo caminho de conversão leva ao WhatsApp da loja: não há carrinho, checkout nem backend.

## Rodar local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Estrutura

```
index.html          página inteira (markup + estilos + script)
assets/             logo, fotos dos produtos, vídeos e posters
robots.txt
sitemap.xml
```

## Trocar as fotos da vitrine

As fotos já vêm recortadas em **4:5** e a **600x750**. Mantenha essa proporção ao
substituir: o card usa `aspect-ratio: 4/5` e uma foto vertical de celular (9:16) perde
30% da altura no corte, normalmente cortando justo o par.

```bash
ffmpeg -i foto-original.jpg \
  -vf "crop=iw:iw*1.25:0:(ih-iw*1.25)*0.5,scale=600:750" -q:v 6 assets/p-nome.jpg
```

O `0.5` no fim é a posição vertical do recorte. Se o tênis estiver na parte de baixo do
enquadramento, use `0.78`.

## Duas armadilhas que já custaram bug aqui

- **Não escreva horário à mão no HTML.** A fonte é o array `DIAS`, no script. Já houve um
  chip fixo dizendo "Seg a sáb" enquanto a tabela logo abaixo mostrava a loja aberta no
  domingo.
- **Cuidado com `padding` shorthand** em quem também usa `.container`. O shorthand
  reescreve os quatro lados e zera o padding lateral herdado, encostando a seção na borda.
  Se precisar mexer só no vertical, use `padding-top` / `padding-bottom`.

## Dados da loja

| Campo | Valor | Fonte |
| --- | --- | --- |
| WhatsApp | (98) 99162-2057 | perfil WhatsApp Business |
| Endereço | Av. Sol Nascente, 100 — Vila Luizão, São Luís/MA, 65068-212 | perfil WhatsApp Business |
| Instagram | [@tenis\_\_head\_](https://www.instagram.com/tenis__head_) | conta vinculada ao WhatsApp |
| Link-bio | fans.link/tenishead | bio do Instagram |
| Google Maps | [ficha](https://www.google.com/maps/place/T%C3%AAnis+head/@-2.4930922,-44.2154497,19.2z) | — |

O horário de funcionamento fica em `DIAS`, no script ao fim do `index.html`. O selo
"Aberto agora" é calculado sempre no fuso de São Luís (`America/Fortaleza`), não no fuso
de quem visita — sem isso, um visitante de outro país veria o status errado.

## Mídia

Os vídeos foram cortados para tirar a interface do Instagram gravada junto e reduzidos de
174 MB para 2,5 MB no total. O trecho do hero foi escolhido numa janela sem as legendas do
reels. Para trocar um vídeo mantendo o mesmo tratamento:

```bash
ffmpeg -ss <segundo_inicial> -i entrada.mov -t <duracao> \
  -vf "crop=in_w:in_h-150:0:0,scale=540:-2,fps=30" -an \
  -c:v libx264 -crf 31 -preset slow -pix_fmt yuv420p -movflags +faststart \
  assets/loja.mp4
```

O `crop=in_w:in_h-150` remove a barra de interface do Instagram no rodapé da gravação.

## Pendências para confirmar com a loja

- **Formas de pagamento e prazo de entrega** — não estão no site porque não havia fonte;
  hoje o passo 4 de "Como comprar" só diz que é combinado na conversa.
- **Preços** — os cards mostram "Consultar valor" em vez de valor cheio.
- **Modelo exato** do Nike ZoomX e da chuteira Mercurial — identificados pela foto,
  vale confirmar a nomenclatura completa.
- **Conta `tenis_sneakerss`** — aparece no campo de link do WhatsApp Business, mas o site
  usa apenas `@tenis__head_`, que é a conta vinculada ao perfil.
- **Ficha do Google Maps** — não foi reivindicada pelo dono e traz o número 9 em vez de
  100. Reivindicar é grátis e corrige o endereço para quem chega pela busca.
