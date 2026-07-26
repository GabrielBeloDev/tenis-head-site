import type { Metadata, Viewport } from 'next';
import { Anton, Archivo, Space_Grotesk } from 'next/font/google';
import { LOJA, URL_INSTAGRAM, URL_MAPA } from '@/core/loja/loja';
import './globals.css';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--fonte-anton', display: 'swap' });
const archivo = Archivo({ subsets: ['latin'], variable: '--fonte-archivo', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--fonte-space-grotesk', display: 'swap' });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tenis-head-site.gabrielbelodev.workers.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: `${LOJA.nome} · Atacado e Varejo de tênis em ${LOJA.cidade} — ${LOJA.estado}`,
  description: `Loja física de tênis em ${LOJA.cidade}/${LOJA.estado}. Varejo e atacado, até ${LOJA.descontoMaximo}% OFF. ${LOJA.endereco.rua} — ${LOJA.endereco.bairro}.`,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  icons: { icon: '/assets/logo.jpg' },
  openGraph: {
    type: 'website',
    siteName: LOJA.nome,
    locale: 'pt_BR',
    url: SITE,
    title: `${LOJA.nome} · Atacado e Varejo em ${LOJA.cidade} — ${LOJA.estado}`,
    description: `Preço justo, qualidade impecável. Varejo e atacado, até ${LOJA.descontoMaximo}% OFF. Fale direto no WhatsApp.`,
    // Absolute URL + explicit size: the WhatsApp crawler resolves neither on its own.
    images: [{ url: '/assets/og.jpg', width: 1200, height: 630, alt: `Prateleiras da ${LOJA.nome} cheias de tênis` }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#0c0c0d' };

const DADOS_ESTRUTURADOS = {
  '@context': 'https://schema.org',
  '@type': 'ShoeStore',
  name: LOJA.nome,
  description: `Atacado e varejo de tênis em ${LOJA.cidade}, Maranhão.`,
  telephone: `+${LOJA.telefoneInternacional}`,
  url: SITE,
  image: `${SITE}/assets/og.jpg`,
  priceRange: '$',
  hasMap: URL_MAPA,
  address: {
    '@type': 'PostalAddress',
    streetAddress: LOJA.endereco.rua,
    addressLocality: LOJA.cidade,
    addressRegion: LOJA.estado,
    postalCode: LOJA.endereco.cep,
    addressCountry: 'BR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: LOJA.endereco.latitude, longitude: LOJA.endereco.longitude },
  sameAs: [URL_INSTAGRAM, LOJA.linkBio],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:30', closes: '12:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '14:30', closes: '19:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '08:30', closes: '12:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '14:00', closes: '19:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '08:30', closes: '12:00' },
  ],
};

export default function LayoutRaiz({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${archivo.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Video posters get Low priority in Chrome and miss the LCP boost an img would get. */}
        <link rel="preload" as="image" href="/assets/loja-poster.jpg" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(DADOS_ESTRUTURADOS) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
