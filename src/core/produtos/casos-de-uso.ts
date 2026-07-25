import { ordenarParaVitrine, type NovoProduto, type Produto } from './produto';
import type { ArmazenamentoDeImagens, RepositorioDeProdutos } from './repositorio-de-produtos';

export async function listarVitrine(repositorio: RepositorioDeProdutos): Promise<readonly Produto[]> {
  const produtos = await repositorio.listar();
  return ordenarParaVitrine(produtos.filter((produto) => produto.destaque));
}

export async function listarTodos(repositorio: RepositorioDeProdutos): Promise<readonly Produto[]> {
  return ordenarParaVitrine(await repositorio.listar());
}

export async function cadastrarProduto(
  repositorio: RepositorioDeProdutos,
  dados: NovoProduto,
): Promise<Produto> {
  return repositorio.criar(dados);
}

export async function atualizarProduto(
  repositorio: RepositorioDeProdutos,
  id: string,
  campos: Partial<NovoProduto>,
): Promise<Produto> {
  return repositorio.atualizar(id, campos);
}

export async function removerProduto(
  repositorio: RepositorioDeProdutos,
  armazenamento: ArmazenamentoDeImagens,
  id: string,
): Promise<void> {
  const produto = await repositorio.buscarPorId(id);
  if (produto === null) throw new Error(`Produto ${id} não encontrado`);

  await repositorio.remover(id);
  await armazenamento.remover(produto.imagem);
}
