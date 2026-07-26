import { CATEGORIAS, type Categoria, type Produto } from '@/core/produtos/produto';
import { clientePublico } from './cliente-publico';
import type { LinhaDeProduto } from './cliente';

function paraCategoria(valor: string): Categoria {
  const encontrada = CATEGORIAS.find((categoria) => categoria === valor);
  if (encontrada === undefined) throw new Error(`Categoria desconhecida vinda do banco: "${valor}"`);
  return encontrada;
}

function paraProduto(linha: LinhaDeProduto): Produto {
  return { ...linha, categoria: paraCategoria(linha.categoria) };
}

export async function lerVitrinePublica(): Promise<readonly Produto[]> {
  const { data, error } = await clientePublico().from('produtos').select('*').eq('destaque', true).order('ordem');
  if (error !== null) throw new Error(`Falha ao ler a vitrine: ${error.message}`);
  return data.map(paraProduto);
}
