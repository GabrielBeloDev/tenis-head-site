'use client';

import { useActionState } from 'react';
import { entrar, type ResultadoDaAcao } from '@/app/admin/acoes';

const CAMPO = 'w-full rounded-xl border border-creme/15 bg-carvao px-4 py-3 text-[15px] outline-none focus:border-vermelho-claro';

export function FormularioDeLogin() {
  const [resultado, executar, enviando] = useActionState<ResultadoDaAcao | null, FormData>(entrar, null);

  return (
    <form action={executar} className="mt-8 grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold">E-mail</span>
        <input name="email" type="email" autoComplete="email" required className={CAMPO} />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">Senha</span>
        <input name="senha" type="password" autoComplete="current-password" required className={CAMPO} />
      </label>

      {resultado !== null && 'erro' in resultado && (
        <p role="alert" className="rounded-xl border border-vermelho/40 bg-vermelho/10 px-4 py-3 text-sm text-vermelho-claro">
          {resultado.erro}
        </p>
      )}

      <button
        disabled={enviando}
        className="mt-2 rounded-full bg-vermelho px-7 py-3.5 font-bold text-white transition hover:bg-vermelho-claro disabled:opacity-50"
      >
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
