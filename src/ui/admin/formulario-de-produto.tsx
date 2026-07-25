'use client';

import { useActionState } from 'react';
import { CATEGORIAS, type Produto } from '@/core/produtos/produto';
import { salvarProduto, type ResultadoDaAcao } from '@/app/admin/acoes';

type PropsDoFormulario = Readonly<{
  produto?: Produto;
  proximaOrdem?: number;
  aoConcluir?: () => void;
}>;

const CAMPO = 'w-full rounded-xl border border-creme/15 bg-carvao px-4 py-3 text-[15px] outline-none focus:border-vermelho-claro';

export function FormularioDeProduto({ produto, proximaOrdem = 1, aoConcluir }: PropsDoFormulario) {
  const [resultado, executar, enviando] = useActionState<ResultadoDaAcao | null, FormData>(
    async (anterior, dados) => {
      const saida = await salvarProduto(anterior, dados);
      if ('sucesso' in saida) aoConcluir?.();
      return saida;
    },
    null,
  );

  return (
    <form action={executar} className="mt-4 grid gap-4 rounded-2xl border border-creme/10 bg-grafite p-5 sm:p-6">
      {produto !== undefined && <input type="hidden" name="id" value={produto.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Modelo</span>
          <input name="nome" defaultValue={produto?.nome} required className={CAMPO} placeholder="Adizero Adios Pro 4" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Marca</span>
          <input name="marca" defaultValue={produto?.marca} required className={CAMPO} placeholder="adidas" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Categoria</span>
          <select name="categoria" defaultValue={produto?.categoria ?? 'lifestyle'} className={CAMPO}>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Posição na vitrine</span>
          <input
            name="ordem"
            type="number"
            min={1}
            defaultValue={produto?.ordem ?? proximaOrdem}
            className={CAMPO}
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">
          Foto {produto !== undefined && <span className="font-normal text-creme/50">— deixe vazio para manter a atual</span>}
        </span>
        <input name="imagem" type="file" accept="image/*" className={`${CAMPO} file:mr-3 file:rounded-full file:border-0 file:bg-vermelho file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white`} />
        <span className="text-xs text-creme/50">
          A foto é exibida em 4:5. Foto de celular na vertical perde as bordas de cima e de baixo no corte.
        </span>
      </label>

      <label className="flex items-center gap-3">
        <input name="destaque" type="checkbox" defaultChecked={produto?.destaque ?? true} className="size-4 accent-[#e01b22]" />
        <span className="text-sm font-semibold">Mostrar na home</span>
      </label>

      {resultado !== null && 'erro' in resultado && (
        <p role="alert" className="rounded-xl border border-vermelho/40 bg-vermelho/10 px-4 py-3 text-sm text-vermelho-claro">
          {resultado.erro}
        </p>
      )}

      {resultado !== null && 'sucesso' in resultado && (
        <p role="status" className="rounded-xl border border-[#7dffa8]/30 bg-[#7dffa8]/10 px-4 py-3 text-sm text-[#7dffa8]">
          Salvo. A vitrine já está atualizada.
        </p>
      )}

      <button
        disabled={enviando}
        className="justify-self-start rounded-full bg-vermelho px-7 py-3.5 font-bold text-white transition hover:bg-vermelho-claro disabled:opacity-50"
      >
        {enviando ? 'Salvando…' : produto === undefined ? 'Adicionar à vitrine' : 'Salvar alterações'}
      </button>
    </form>
  );
}
