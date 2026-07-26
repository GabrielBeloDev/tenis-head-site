import type { NovoProduto, Produto } from '@/core/produtos/produto';
import type { RepositorioDeProdutos } from '@/core/produtos/repositorio-de-produtos';

export const PRODUTOS_INICIAIS: readonly Produto[] = [
  { id: 'nocta-glide', nome: 'NOCTA Glide', marca: 'Nike', categoria: 'lifestyle', imagem: '/assets/p-nocta.jpg', destaque: true, ordem: 1 },
  { id: 'adizero-adios-pro-4', nome: 'Adizero Adios Pro 4', marca: 'adidas', categoria: 'corrida', imagem: '/assets/p-adios-pro4.jpg', destaque: true, ordem: 2 },
  { id: 'zoomx', nome: 'ZoomX', marca: 'Nike', categoria: 'corrida', imagem: '/assets/p-zoomx.jpg', destaque: true, ordem: 3 },
  { id: 'mercurial', nome: 'Mercurial', marca: 'Nike', categoria: 'campo', imagem: '/assets/p-mercurial.jpg', destaque: true, ordem: 4 },
];

export function criarRepositorioEmMemoria(
  iniciais: readonly Produto[] = PRODUTOS_INICIAIS,
): RepositorioDeProdutos {
  const produtos = new Map(iniciais.map((produto) => [produto.id, produto]));

  return {
    async listar() {
      return [...produtos.values()];
    },

    async buscarPorId(id) {
      return produtos.get(id) ?? null;
    },

    async criar(dados: NovoProduto) {
      const id = `${dados.nome.toLowerCase().replace(/\s+/g, '-')}-${produtos.size + 1}`;
      const produto: Produto = { ...dados, id };
      produtos.set(id, produto);
      return produto;
    },

    async atualizar(id, campos) {
      const atual = produtos.get(id);
      if (atual === undefined) throw new Error(`Produto ${id} não encontrado`);

      const atualizado: Produto = { ...atual, ...campos };
      produtos.set(id, atualizado);
      return atualizado;
    },

    async remover(id) {
      produtos.delete(id);
    },
  };
}
