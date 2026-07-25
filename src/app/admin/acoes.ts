'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { CATEGORIAS } from '@/core/produtos/produto';
import { cadastrarProduto, atualizarProduto, removerProduto } from '@/core/produtos/casos-de-uso';
import { criarArmazenamentoSupabase } from '@/infra/supabase/armazenamento-de-imagens';
import { clienteDoServidor } from '@/infra/supabase/cliente';
import { criarRepositorioSupabase } from '@/infra/supabase/repositorio-de-produtos';

const TAMANHO_MAXIMO = 8 * 1024 * 1024;
const FORMATOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// Server Action é uma entrada HTTP própria: proteger só a rota no middleware não a cobre.
async function exigirSessao(): Promise<void> {
  const supabase = await clienteDoServidor();
  const { data } = await supabase.auth.getUser();
  if (data.user === null) throw new Error('Não autorizado');
}

const esquemaDoProduto = z.object({
  nome: z.string().trim().min(2, 'Informe o nome do modelo'),
  marca: z.string().trim().min(2, 'Informe a marca'),
  categoria: z.enum(CATEGORIAS),
  ordem: z.coerce.number().int().min(1),
  destaque: z.coerce.boolean(),
});

const esquemaDaImagem = z
  .instanceof(File)
  .refine((arquivo) => arquivo.size > 0, 'Escolha uma foto')
  .refine((arquivo) => arquivo.size <= TAMANHO_MAXIMO, 'A foto precisa ter no máximo 8 MB')
  .refine((arquivo) => FORMATOS_ACEITOS.includes(arquivo.type), 'Envie a foto em JPEG, PNG, WebP ou AVIF');

export type ResultadoDaAcao = { erro: string } | { sucesso: true };

export async function entrar(_anterior: ResultadoDaAcao | null, dados: FormData): Promise<ResultadoDaAcao> {
  const credenciais = z
    .object({ email: z.string().email('E-mail inválido'), senha: z.string().min(6, 'Senha muito curta') })
    .safeParse({ email: dados.get('email'), senha: dados.get('senha') });

  if (!credenciais.success) {
    return { erro: credenciais.error.issues[0]?.message ?? 'Dados inválidos' };
  }

  const supabase = await clienteDoServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: credenciais.data.email,
    password: credenciais.data.senha,
  });

  if (error !== null) return { erro: 'E-mail ou senha incorretos' };

  redirect('/admin');
}

export async function sair(): Promise<void> {
  const supabase = await clienteDoServidor();
  await supabase.auth.signOut();
  redirect('/admin/entrar');
}

export async function salvarProduto(
  _anterior: ResultadoDaAcao | null,
  dados: FormData,
): Promise<ResultadoDaAcao> {
  await exigirSessao();

  const campos = esquemaDoProduto.safeParse({
    nome: dados.get('nome'),
    marca: dados.get('marca'),
    categoria: dados.get('categoria'),
    ordem: dados.get('ordem'),
    destaque: dados.get('destaque') === 'on',
  });

  if (!campos.success) return { erro: campos.error.issues[0]?.message ?? 'Dados inválidos' };

  const id = dados.get('id');
  const arquivo = dados.get('imagem');
  const repositorio = criarRepositorioSupabase();

  const enviarImagem = arquivo instanceof File && arquivo.size > 0;
  if (enviarImagem) {
    const imagem = esquemaDaImagem.safeParse(arquivo);
    if (!imagem.success) return { erro: imagem.error.issues[0]?.message ?? 'Imagem inválida' };
  }

  try {
    const imagem = enviarImagem
      ? await criarArmazenamentoSupabase().enviar(arquivo, crypto.randomUUID())
      : null;

    if (typeof id === 'string' && id !== '') {
      await atualizarProduto(repositorio, id, { ...campos.data, ...(imagem === null ? {} : { imagem }) });
    } else {
      if (imagem === null) return { erro: 'Escolha uma foto para o produto' };
      await cadastrarProduto(repositorio, { ...campos.data, imagem });
    }
  } catch (erro) {
    // Mensagem do Postgres expõe tabela e política, e não diz nada útil para quem está no painel.
    console.error('Falha ao salvar produto', erro);
    return { erro: 'Não foi possível salvar. Tente de novo.' };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { sucesso: true };
}

export async function excluirProduto(dados: FormData): Promise<void> {
  await exigirSessao();

  const id = dados.get('id');
  if (typeof id !== 'string' || id === '') throw new Error('Produto não informado');

  await removerProduto(criarRepositorioSupabase(), criarArmazenamentoSupabase(), id);
  revalidatePath('/');
  revalidatePath('/admin');
}
