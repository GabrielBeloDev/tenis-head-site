import { listarVitrine } from '@/core/produtos/casos-de-uso';
import { repositorioDeProdutos } from '@/infra/produtos/fabrica';
import { ALoja } from '@/ui/secoes/a-loja';
import { Cabecalho } from '@/ui/secoes/cabecalho';
import { ComoComprar } from '@/ui/secoes/como-comprar';
import { Hero } from '@/ui/secoes/hero';
import { OndeEstamos } from '@/ui/secoes/onde-estamos';
import { BotaoFlutuante, ChamadaFinal, Rodape } from '@/ui/secoes/rodape';
import { Ticker } from '@/ui/secoes/ticker';
import { Vitrine } from '@/ui/secoes/vitrine';

export default async function Home() {
  const produtos = await listarVitrine(repositorioDeProdutos());

  return (
    <>
      <Cabecalho />
      <main id="topo">
        <Hero />
        <Ticker />
        <Vitrine produtos={produtos} />
        <ComoComprar />
        <ALoja />
        <OndeEstamos />
        <ChamadaFinal />
      </main>
      <Rodape />
      <BotaoFlutuante />
    </>
  );
}
