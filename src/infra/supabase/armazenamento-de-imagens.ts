import type { ArmazenamentoDeImagens } from '@/core/produtos/repositorio-de-produtos';
import { clienteDoServidor } from './cliente';

const BALDE = 'produtos';

export function criarArmazenamentoSupabase(): ArmazenamentoDeImagens {
  return {
    async enviar(arquivo, nome) {
      const supabase = await clienteDoServidor();
      const caminho = `${nome}-${arquivo.name.replace(/[^\w.-]/g, '')}`;

      const { error } = await supabase.storage.from(BALDE).upload(caminho, arquivo, { upsert: true });
      if (error !== null) throw new Error(`Falha ao enviar a imagem: ${error.message}`);

      return supabase.storage.from(BALDE).getPublicUrl(caminho).data.publicUrl;
    },

    async remover(url) {
      const supabase = await clienteDoServidor();
      const caminho = url.split(`/${BALDE}/`).slice(1).join(`/${BALDE}/`);

      const { error } = await supabase.storage.from(BALDE).remove([caminho]);
      if (error !== null) throw new Error(`Falha ao remover a imagem: ${error.message}`);
    },
  };
}
