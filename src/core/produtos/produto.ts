export type Categoria = 'lifestyle' | 'corrida' | 'campo' | 'treino' | 'casual';

export type Produto = Readonly<{
  id: string;
  nome: string;
  marca: string;
  categoria: Categoria;
  imagem: string;
  destaque: boolean;
  ordem: number;
}>;

export type NovoProduto = Omit<Produto, 'id'>;

export const CATEGORIAS: readonly Categoria[] = ['lifestyle', 'corrida', 'campo', 'treino', 'casual'];

export const PROPORCAO_DA_FOTO = { largura: 600, altura: 750 } as const;

export function etiquetaDoProduto(produto: Produto): string {
  return `${produto.marca} · ${produto.categoria}`;
}

export function ordenarParaVitrine(produtos: readonly Produto[]): readonly Produto[] {
  return [...produtos].sort((a, b) => a.ordem - b.ordem);
}
