import { CATEGORIAS, type Categoria, type NovoProduto, type Produto } from '@/core/produtos/produto';
import type { RepositorioDeProdutos } from '@/core/produtos/repositorio-de-produtos';
import { clienteDoServidor, type LinhaDeProduto } from './cliente';

const TABELA = 'produtos';

function paraCategoria(valor: string): Categoria {
  const encontrada = CATEGORIAS.find((categoria) => categoria === valor);
  if (encontrada === undefined) throw new Error(`Categoria desconhecida vinda do banco: "${valor}"`);
  return encontrada;
}

function paraProduto(linha: LinhaDeProduto): Produto {
  return { ...linha, categoria: paraCategoria(linha.categoria) };
}

export function criarRepositorioSupabase(): RepositorioDeProdutos {
  return {
    async listar() {
      const supabase = await clienteDoServidor();
      const { data, error } = await supabase.from(TABELA).select('*').order('ordem');
      if (error !== null) throw new Error(`Falha ao listar produtos: ${error.message}`);
      return data.map(paraProduto);
    },

    async buscarPorId(id) {
      const supabase = await clienteDoServidor();
      const { data, error } = await supabase.from(TABELA).select('*').eq('id', id).maybeSingle();
      if (error !== null) throw new Error(`Falha ao buscar produto ${id}: ${error.message}`);
      return data === null ? null : paraProduto(data);
    },

    async criar(produto: NovoProduto) {
      const supabase = await clienteDoServidor();
      const { data, error } = await supabase.from(TABELA).insert(produto).select().single();
      if (error !== null) throw new Error(`Falha ao cadastrar produto: ${error.message}`);
      return paraProduto(data);
    },

    async atualizar(id, campos) {
      const supabase = await clienteDoServidor();
      const { data, error } = await supabase.from(TABELA).update(campos).eq('id', id).select().single();
      if (error !== null) throw new Error(`Falha ao atualizar produto ${id}: ${error.message}`);
      return paraProduto(data);
    },

    async remover(id) {
      const supabase = await clienteDoServidor();
      const { error } = await supabase.from(TABELA).delete().eq('id', id);
      if (error !== null) throw new Error(`Falha ao remover produto ${id}: ${error.message}`);
    },
  };
}
