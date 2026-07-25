'use client';

import Image from 'next/image';
import { useState } from 'react';
import { excluirProduto } from '@/app/admin/acoes';
import { etiquetaDoProduto, type Produto } from '@/core/produtos/produto';
import { FormularioDeProduto } from './formulario-de-produto';

export function ListaDeProdutos({ produtos }: Readonly<{ produtos: readonly Produto[] }>) {
  const [emEdicao, setEmEdicao] = useState<string | null>(null);

  if (produtos.length === 0) {
    return <p className="mt-4 text-creme/60">Nenhum par cadastrado ainda.</p>;
  }

  return (
    <ul className="mt-4 grid gap-3">
      {produtos.map((produto) => (
        <li key={produto.id} className="rounded-2xl border border-creme/10 bg-carvao p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Image
              src={produto.imagem}
              alt=""
              width={64}
              height={80}
              className="size-16 rounded-lg object-cover"
            />

            <div className="min-w-40 flex-1">
              <p className="font-titulo text-lg uppercase">{produto.nome}</p>
              <p className="font-mono text-[11px] tracking-wide text-cinza uppercase">
                {etiquetaDoProduto(produto)} · posição {produto.ordem}
                {!produto.destaque && ' · oculto na home'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEmEdicao(emEdicao === produto.id ? null : produto.id)}
                className="rounded-full border border-creme/25 px-4 py-2 text-sm font-semibold transition hover:border-creme"
              >
                {emEdicao === produto.id ? 'Fechar' : 'Editar'}
              </button>

              <form action={excluirProduto}>
                <input type="hidden" name="id" value={produto.id} />
                <button className="rounded-full border border-vermelho/40 px-4 py-2 text-sm font-semibold text-vermelho-claro transition hover:bg-vermelho/10">
                  Remover
                </button>
              </form>
            </div>
          </div>

          {emEdicao === produto.id && (
            <FormularioDeProduto produto={produto} aoConcluir={() => setEmEdicao(null)} />
          )}
        </li>
      ))}
    </ul>
  );
}
