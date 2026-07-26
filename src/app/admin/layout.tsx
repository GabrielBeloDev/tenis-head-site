import { redirect } from 'next/navigation';
import { supabaseDisponivel } from '@/infra/produtos/fabrica';
import { clienteDoServidor } from '@/infra/supabase/cliente';
import { NavegacaoInferior, NavegacaoLateral } from '@/ui/admin/navegacao-do-painel';
import { sair } from './acoes';

export default async function LayoutDoPainel({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!supabaseDisponivel()) return <>{children}</>;

  const supabase = await clienteDoServidor();
  const { data } = await supabase.auth.getUser();
  if (data.user === null) return <>{children}</>;

  return (
    <div className="flex min-h-dvh">
      <NavegacaoLateral email={data.user.email ?? ''} />

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-creme/10 px-5 py-4 lg:px-8">
          <div className="min-w-0 lg:hidden">
            <p className="font-titulo text-lg uppercase">Painel</p>
            <p className="truncate font-mono text-[10px] tracking-wide text-cinza uppercase">
              {data.user.email}
            </p>
          </div>
          <span className="hidden lg:block" />
          <form action={sair}>
            <button className="rounded-full border border-creme/25 px-5 py-2.5 text-sm font-semibold transition hover:border-creme">
              Sair
            </button>
          </form>
        </header>

        <main className="px-5 pt-6 pb-28 lg:px-8 lg:pb-10">{children}</main>
      </div>

      <NavegacaoInferior />
    </div>
  );
}
