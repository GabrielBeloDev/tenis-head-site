'use client';

import { useState } from 'react';
import { excluirProduto } from '@/app/admin/acoes';
import { etiquetaDoProduto, type Produto } from '@/core/produtos/produto';
import { FormularioDeProduto } from './formulario-de-produto';

export function ListaDeProdutos({ produtos }: Readonly<{ produtos: readonly Produto[] }>) {
  const [emEdicao, setEmEdicao] = useState<string | null>(null);
  const [confirmandoRemocao, setConfirmandoRemocao] = useState<string | null>(null);

  if (produtos.length === 0) {
    return (
      <p className="mt-4 rounded-2xl border border-dashed border-creme/20 p-8 text-center text-creme/60">
        Nenhum par cadastrado ainda. Use o formulário acima para colocar o primeiro na vitrine.
      </p>
    );
  }

  return (
    <ul className="mt-4 grid gap-3">
      {produtos.map((produto) => (
        <li key={produto.id} className="rounded-2xl border border-creme/10 bg-carvao p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={produto.imagem} alt="" className="h-20 w-16 shrink-0 rounded-lg object-cover" />

            <div className="min-w-40 flex-1">
              <p className="font-titulo text-lg uppercase">{produto.nome}</p>
              <p className="font-mono text-[11px] tracking-wide text-cinza uppercase">
                {etiquetaDoProduto(produto)} · {produto.ordem}º na vitrine
              </p>
              {!produto.destaque && (
                <p className="mt-1.5 inline-block rounded-full border border-creme/25 px-2.5 py-1 font-mono text-[10px] tracking-wide text-creme/70 uppercase">
                  não aparece no site
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setEmEdicao(emEdicao === produto.id ? null : produto.id); setConfirmandoRemocao(null); }}
                className="rounded-full border border-creme/25 px-4 py-2 text-sm font-semibold transition hover:border-creme"
              >
                {emEdicao === produto.id ? 'Fechar' : 'Editar'}
              </button>

              <button
                onClick={() => setConfirmandoRemocao(confirmandoRemocao === produto.id ? null : produto.id)}
                className="rounded-full border border-vermelho/40 px-4 py-2 text-sm font-semibold text-vermelho-claro transition hover:bg-vermelho/10"
              >
                Remover
              </button>
            </div>
          </div>

          {confirmandoRemocao === produto.id && (
            <div className="mt-4 rounded-xl border border-vermelho/40 bg-vermelho/10 p-4">
              <p className="text-sm font-semibold">Remover {produto.nome} de vez?</p>
              <p className="mt-1 text-xs leading-relaxed text-creme/70">
                A foto é apagada junto e não dá para desfazer. Se o par só acabou no estoque, prefira
                editar e desmarcar &ldquo;mostrar na home&rdquo;.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <form action={excluirProduto}>
                  <input type="hidden" name="id" value={produto.id} />
                  <button className="rounded-full bg-vermelho px-5 py-2.5 text-sm font-bold text-white transition hover:bg-vermelho-claro">
                    Sim, remover
                  </button>
                </form>
                <button
                  onClick={() => setConfirmandoRemocao(null)}
                  className="rounded-full border border-creme/25 px-5 py-2.5 text-sm font-semibold transition hover:border-creme"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {emEdicao === produto.id && (
            <FormularioDeProduto produto={produto} aoConcluir={() => setEmEdicao(null)} />
          )}
        </li>
      ))}
    </ul>
  );
}
