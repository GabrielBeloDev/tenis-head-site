import { supabaseDisponivel } from '@/infra/produtos/fabrica';
import { clienteDoServidor } from '@/infra/supabase/cliente';
import { BotaoDoMenu, NavegacaoLateral } from '@/ui/admin/navegacao-do-painel';
import { sair } from './acoes';

export default async function LayoutDoPainel({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!supabaseDisponivel()) return <>{children}</>;

  const supabase = await clienteDoServidor();
  const { data } = await supabase.auth.getUser();
  if (data.user === null) return <>{children}</>;

  const email = data.user.email ?? '';

  return (
    <div className="flex min-h-dvh">
      <NavegacaoLateral email={email} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-creme/10 bg-preto/95 px-5 py-3 backdrop-blur-lg lg:px-8 lg:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <BotaoDoMenu email={email} />
            <p className="truncate font-mono text-[10px] tracking-wide text-cinza uppercase">{email}</p>
          </div>

          <form action={sair}>
            <button className="rounded-full border border-creme/25 px-5 py-2.5 text-sm font-semibold transition hover:border-creme">
              Sair
            </button>
          </form>
        </header>

        <main className="px-5 pt-6 pb-16 lg:px-8 lg:pb-10">{children}</main>
      </div>
    </div>
  );
}
