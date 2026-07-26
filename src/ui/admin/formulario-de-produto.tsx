'use client';

import Image from 'next/image';
import { useActionState, useEffect, useState } from 'react';
import { CATEGORIAS, type Categoria, type Produto } from '@/core/produtos/produto';
import { salvarProduto, type ResultadoDaAcao } from '@/app/admin/acoes';
import { recortarParaVitrine, type PosicaoDoCorte } from '@/infra/imagem/recortar-para-vitrine';
import { Dica } from './dica';

type PropsDoFormulario = Readonly<{
  produto?: Produto;
  proximaOrdem?: number;
  aoConcluir?: () => void;
}>;

const CAMPO =
  'w-full rounded-xl border border-creme/15 bg-carvao px-4 py-3 text-[15px] outline-none transition focus:border-vermelho-claro';

const NOME_DA_CATEGORIA: Readonly<Record<Categoria, string>> = {
  lifestyle: 'Lifestyle (dia a dia)',
  corrida: 'Corrida',
  campo: 'Chuteira de campo',
  treino: 'Treino / academia',
  casual: 'Casual',
};

type PropsDoCampo = Readonly<{
  titulo: string;
  ajuda: string;
  dica: string;
  children: React.ReactNode;
}>;

function Campo({ titulo, ajuda, dica, children }: PropsDoCampo) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-center gap-2 text-sm font-semibold">
        {titulo}
        <Dica texto={dica} />
      </span>
      <span className="text-xs leading-relaxed text-creme/55">{ajuda}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

export function FormularioDeProduto({ produto, proximaOrdem = 1, aoConcluir }: PropsDoFormulario) {
  const [posicaoDoCorte, setPosicaoDoCorte] = useState<PosicaoDoCorte>('centro');
  const [previa, setPrevia] = useState<string | null>(null);

  useEffect(() => () => { if (previa !== null) URL.revokeObjectURL(previa); }, [previa]);

  const [resultado, executar, enviando] = useActionState<ResultadoDaAcao | null, FormData>(
    async (anterior, dados) => {
      const escolhida = dados.get('imagem');
      if (escolhida instanceof File && escolhida.size > 0) {
        dados.set('imagem', await recortarParaVitrine(escolhida, posicaoDoCorte));
      }

      const saida = await salvarProduto(anterior, dados);
      if ('sucesso' in saida) aoConcluir?.();
      return saida;
    },
    null,
  );

  async function aoEscolherFoto(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (arquivo === undefined) return;

    const recortada = await recortarParaVitrine(arquivo, posicaoDoCorte);
    setPrevia(URL.createObjectURL(recortada));
  }

  return (
    <form action={executar} className="mt-4 grid gap-5 rounded-2xl border border-creme/10 bg-grafite p-5 sm:p-6">
      {produto !== undefined && <input type="hidden" name="id" value={produto.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          titulo="Modelo"
          ajuda="Só o nome do tênis, sem a marca. Aparece grande no card."
          dica="Escreva como o cliente fala. Esse texto também entra na mensagem que abre no WhatsApp quando ele toca no card, então evite código interno ou abreviação."
        >
          <input name="nome" defaultValue={produto?.nome} required className={CAMPO} placeholder="Adizero Adios Pro 4" />
        </Campo>

        <Campo
          titulo="Marca"
          ajuda="Nike, adidas, New Balance, Puma…"
          dica="Aparece em cima do nome, em letra pequena. Mantenha sempre a mesma grafia, senão a vitrine fica com adidas e Adidas misturados."
        >
          <input name="marca" defaultValue={produto?.marca} required className={CAMPO} placeholder="adidas" />
        </Campo>

        <Campo
          titulo="Categoria"
          ajuda="Aparece em cima do nome, junto com a marca."
          dica="Serve para o cliente entender o uso do par de relance. Escolha pelo uso principal, mesmo que sirva para mais de uma coisa."
        >
          <select name="categoria" defaultValue={produto?.categoria ?? 'lifestyle'} className={CAMPO}>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {NOME_DA_CATEGORIA[categoria]}
              </option>
            ))}
          </select>
        </Campo>

        <Campo
          titulo="Ordem"
          ajuda="1 aparece primeiro. Use para colocar o lançamento na frente."
          dica="Se dois produtos tiverem o mesmo número, os dois aparecem, só não dá para prever qual vem antes. Para reordenar, troque o número dos dois."
        >
          <input name="ordem" type="number" min={1} defaultValue={produto?.ordem ?? proximaOrdem} className={CAMPO} />
        </Campo>
      </div>

      <Campo
        titulo={produto === undefined ? 'Foto do par' : 'Trocar a foto'}
        dica="Foto de celular serve. O corte para 4:5 acontece aqui no navegador, então o que sobe já é pequeno e não gasta seu limite de armazenamento. Aceita JPEG, PNG e WebP, até 8 MB."
        ajuda={
          produto === undefined
            ? 'Pode mandar direto do celular. A foto é cortada em 4:5 aqui no navegador antes de subir, então não precisa editar antes.'
            : 'Deixe em branco para manter a foto atual.'
        }
      >
        <input
          name="imagem"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={aoEscolherFoto}
          className={`${CAMPO} file:mr-3 file:rounded-full file:border-0 file:bg-vermelho file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white`}
        />
      </Campo>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold">Onde está o tênis na foto?</legend>
        <span className="text-xs text-creme/55">
          Foto de celular é mais alta que o card, então parte dela é cortada. Isso diz o que preservar.
        </span>
        <div className="mt-1 flex flex-wrap gap-4">
          {(['centro', 'base'] as const).map((posicao) => (
            <label key={posicao} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="posicaoDoCorte"
                checked={posicaoDoCorte === posicao}
                onChange={() => setPosicaoDoCorte(posicao)}
                className="size-4 accent-[#e01b22]"
              />
              {posicao === 'centro' ? 'No meio' : 'Na parte de baixo'}
            </label>
          ))}
        </div>
      </fieldset>

      {(previa ?? produto?.imagem) !== undefined && (previa ?? produto?.imagem) !== null && (
        <div className="flex items-center gap-4 rounded-xl border border-creme/10 bg-carvao p-4">
          <Image
            src={previa ?? produto?.imagem ?? ''}
            alt=""
            width={80}
            height={100}
            unoptimized={previa !== null}
            className="h-25 w-20 rounded-lg object-cover"
          />
          <p className="text-xs leading-relaxed text-creme/60">
            {previa === null ? 'Foto atual do produto.' : 'É exatamente assim que vai aparecer no site.'}
          </p>
        </div>
      )}

      <label className="flex items-start gap-3 rounded-xl border border-creme/10 bg-carvao p-4">
        <input
          name="destaque"
          type="checkbox"
          defaultChecked={produto?.destaque ?? true}
          className="mt-0.5 size-4 accent-[#e01b22]"
        />
        <span>
          <span className="block text-sm font-semibold">Mostrar na home</span>
          <span className="block text-xs text-creme/55">
            Desmarque para tirar da vitrine sem apagar o cadastro, por exemplo quando o par acaba.
          </span>
        </span>
      </label>

      {resultado !== null && 'erro' in resultado && (
        <p role="alert" className="rounded-xl border border-vermelho/40 bg-vermelho/10 px-4 py-3 text-sm text-vermelho-claro">
          {resultado.erro}
        </p>
      )}

      {resultado !== null && 'sucesso' in resultado && (
        <p role="status" className="rounded-xl border border-[#7dffa8]/30 bg-[#7dffa8]/10 px-4 py-3 text-sm text-[#7dffa8]">
          Pronto. A vitrine do site já está atualizada.
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
