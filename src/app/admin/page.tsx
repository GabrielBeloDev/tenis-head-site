import { redirect } from 'next/navigation';
import { listarTodos } from '@/core/produtos/casos-de-uso';
import { supabaseDisponivel } from '@/infra/produtos/fabrica';
import { clienteDoServidor } from '@/infra/supabase/cliente';
import { criarRepositorioSupabase } from '@/infra/supabase/repositorio-de-produtos';
import { FormularioDeProduto } from '@/ui/admin/formulario-de-produto';
import { ListaDeProdutos } from '@/ui/admin/lista-de-produtos';
import { sair } from './acoes';

export const metadata = { title: 'Painel · Tênis Head', robots: { index: false } };

export default async function Painel() {
  if (!supabaseDisponivel()) return <SupabaseAusente />;

  const supabase = await clienteDoServidor();
  const { data } = await supabase.auth.getUser();
  if (data.user === null) redirect('/admin/entrar');

  const produtos = await listarTodos(criarRepositorioSupabase());

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-creme/10 pb-6">
        <div>
          <h1 className="font-titulo text-3xl uppercase">Vitrine</h1>
          <p className="mt-1 text-sm text-creme/60">
            {produtos.length} {produtos.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'} ·{' '}
            {data.user.email}
          </p>
        </div>
        <form action={sair}>
          <button className="rounded-full border border-creme/25 px-5 py-2.5 text-sm font-semibold transition hover:border-creme">
            Sair
          </button>
        </form>
      </header>

      <section className="mt-8">
        <h2 className="font-titulo text-xl uppercase">Adicionar par</h2>
        <FormularioDeProduto proximaOrdem={produtos.length + 1} />
      </section>

      <section className="mt-12">
        <h2 className="font-titulo text-xl uppercase">Na vitrine</h2>
        <ListaDeProdutos produtos={produtos} />
      </section>
    </main>
  );
}

function SupabaseAusente() {
  return (
    <main className="mx-auto max-w-xl px-5 py-20">
      <h1 className="font-titulo text-3xl uppercase">Painel indisponível</h1>
      <p className="mt-4 leading-relaxed text-creme/70">
        O painel precisa das variáveis <code className="text-vermelho-claro">NEXT_PUBLIC_SUPABASE_URL</code> e{' '}
        <code className="text-vermelho-claro">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Enquanto não estiverem
        definidas, o site segue no ar com a vitrine inicial e nada aqui é gravado.
      </p>
    </main>
  );
}
