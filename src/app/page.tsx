import { ordenarParaVitrine } from '@/core/produtos/produto';
import { PRODUTOS_INICIAIS } from '@/infra/produtos/repositorio-em-memoria';
import { supabaseDisponivel } from '@/infra/produtos/fabrica';
import { lerVitrinePublica } from '@/infra/supabase/repositorio-publico';
import { ALoja } from '@/ui/secoes/a-loja';
import { Cabecalho } from '@/ui/secoes/cabecalho';
import { ComoComprar } from '@/ui/secoes/como-comprar';
import { Hero } from '@/ui/secoes/hero';
import { OndeEstamos } from '@/ui/secoes/onde-estamos';
import { ChamadaFinal, Rodape } from '@/ui/secoes/rodape';
import { BotaoFlutuante } from '@/ui/componentes/botao-flutuante';
import { Ticker } from '@/ui/secoes/ticker';
import { Vitrine } from '@/ui/secoes/vitrine';

export const revalidate = 60;

export default async function Home() {
  const produtos = supabaseDisponivel()
    ? await lerVitrinePublica()
    : ordenarParaVitrine(PRODUTOS_INICIAIS.filter((produto) => produto.destaque));

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
