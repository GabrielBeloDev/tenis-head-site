export const LOJA = {
  nome: 'Tênis Head',
  chamada: 'Atacado e varejo',
  cidade: 'São Luís',
  estado: 'MA',
  telefone: '(98) 99162-2057',
  telefoneInternacional: '5598991622057',
  instagram: '@tenis__head_',
  linkBio: 'https://fans.link/tenishead',
  endereco: {
    rua: 'Av. Sol Nascente, 100',
    bairro: 'Vila Luizão',
    cep: '65068-212',
    latitude: -2.4929453,
    longitude: -44.2153237,
  },
  minimoAtacado: 2,
  descontoMaximo: 48,
} as const;

export const URL_INSTAGRAM = `https://www.instagram.com/${LOJA.instagram.replace('@', '')}`;

export const URL_MAPA =
  'https://www.google.com/maps/place/T%C3%AAnis+head/@-2.4930922,-44.2154497,19.2z/data=!4m6!3m5!1s0x7f6930009136d2d:0x4ef7963695032609!8m2!3d-2.4929453!4d-44.2153237';

export function linkWhatsApp(assunto?: string): string {
  const mensagem = assunto
    ? `Olá! Tenho interesse no ${assunto} que vi no site.`
    : 'Olá! Vi o site da Tênis Head e quero saber sobre um par.';

  return `https://wa.me/${LOJA.telefoneInternacional}?text=${encodeURIComponent(mensagem)}`;
}
