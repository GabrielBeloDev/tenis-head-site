import Link from 'next/link';
import { redirect } from 'next/navigation';
import { listarTodos } from '@/core/produtos/casos-de-uso';
import { supabaseDisponivel } from '@/infra/produtos/fabrica';
import { clienteDoServidor } from '@/infra/supabase/cliente';
import { criarRepositorioSupabase } from '@/infra/supabase/repositorio-de-produtos';
import { ListaDeProdutos } from '@/ui/admin/lista-de-produtos';

export const metadata = { title: 'Painel · Tênis Head', robots: { index: false } };

export default async function Painel() {
  if (!supabaseDisponivel()) return <SupabaseAusente />;

  const supabase = await clienteDoServidor();
  const { data } = await supabase.auth.getUser();
  if (data.user === null) redirect('/admin/entrar');

  const produtos = await listarTodos(criarRepositorioSupabase());
  const naHome = produtos.filter((produto) => produto.destaque).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-titulo text-3xl uppercase">Vitrine</h1>
          <p className="mt-1 text-sm text-creme/60">
            {produtos.length} {produtos.length === 1 ? 'par cadastrado' : 'pares cadastrados'} ·{' '}
            {naHome} aparecendo no site
          </p>
        </div>

        <Link
          href="/admin/novo"
          className="rounded-full bg-vermelho px-6 py-3 text-sm font-bold text-white transition hover:bg-vermelho-claro"
        >
          Adicionar par
        </Link>
      </div>

      <div className="mt-6">
        <ListaDeProdutos produtos={produtos} />
      </div>
    </>
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
