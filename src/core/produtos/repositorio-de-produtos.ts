import type { NovoProduto, Produto } from './produto';

export interface RepositorioDeProdutos {
  listar(): Promise<readonly Produto[]>;
  buscarPorId(id: string): Promise<Produto | null>;
  criar(produto: NovoProduto): Promise<Produto>;
  atualizar(id: string, campos: Partial<NovoProduto>): Promise<Produto>;
  remover(id: string): Promise<void>;
}

export interface ArmazenamentoDeImagens {
  enviar(arquivo: File, nome: string): Promise<string>;
  remover(caminho: string): Promise<void>;
}
