# Tênis Head — site

Site institucional de uma página da **Tênis Head**, loja de atacado e varejo de tênis em
São Luís — MA. HTML, CSS e JavaScript puros, sem build e sem dependências.

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
```

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
174 MB para ~4,5 MB no total. Para trocar um vídeo mantendo o mesmo tratamento:

```bash
ffmpeg -ss <segundo_inicial> -i entrada.mov -t <duracao> \
  -vf "crop=in_w:in_h-150:0:0,scale=720:-2,fps=30" -an \
  -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart \
  assets/loja.mp4
```

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
