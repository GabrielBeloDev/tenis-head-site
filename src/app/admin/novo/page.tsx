import Link from 'next/link';
import { redirect } from 'next/navigation';
import { listarTodos } from '@/core/produtos/casos-de-uso';
import { supabaseDisponivel } from '@/infra/produtos/fabrica';
import { clienteDoServidor } from '@/infra/supabase/cliente';
import { criarRepositorioSupabase } from '@/infra/supabase/repositorio-de-produtos';
import { FormularioDeProduto } from '@/ui/admin/formulario-de-produto';

export const metadata = { title: 'Adicionar par · Tênis Head', robots: { index: false } };

export default async function AdicionarPar() {
  if (!supabaseDisponivel()) redirect('/admin');

  const supabase = await clienteDoServidor();
  const { data } = await supabase.auth.getUser();
  if (data.user === null) redirect('/admin/entrar');

  const produtos = await listarTodos(criarRepositorioSupabase());

  return (
    <>
      <Link href="/admin" className="font-mono text-[11px] tracking-wide text-cinza uppercase hover:text-creme">
        ← Voltar para a vitrine
      </Link>

      <h1 className="mt-3 font-titulo text-3xl uppercase">Adicionar par</h1>
      <p className="mt-1 max-w-xl text-sm leading-relaxed text-creme/60">
        Assim que salvar, o par aparece no site na hora. Dá para editar ou tirar depois, quando quiser.
      </p>

      <div className="max-w-3xl">
        <FormularioDeProduto proximaOrdem={produtos.length + 1} />
      </div>
    </>
  );
}
