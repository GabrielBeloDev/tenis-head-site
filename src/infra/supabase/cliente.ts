import { createServerClient } from '@supabase/ssr';
import { createBrowserClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { exigirConfiguracao } from './configuracao';

export type LinhaDeProduto = {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  imagem: string;
  destaque: boolean;
  ordem: number;
};

export type EsquemaDoBanco = {
  public: {
    Tables: {
      produtos: {
        Row: LinhaDeProduto;
        Insert: Omit<LinhaDeProduto, 'id'> & { id?: string };
        Update: Partial<Omit<LinhaDeProduto, 'id'>>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export async function clienteDoServidor() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = exigirConfiguracao();
  const armazenamentoDeCookies = await cookies();

  return createServerClient<EsquemaDoBanco>(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => armazenamentoDeCookies.getAll(),
      setAll: (aDefinir) => {
        // Server Components cannot write cookies; the middleware refreshes the session.
        try {
          aDefinir.forEach(({ name, value, options }) => armazenamentoDeCookies.set(name, value, options));
        } catch {
          return;
        }
      },
    },
  });
}

export function clienteDoNavegador() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = exigirConfiguracao();
  return createBrowserClient<EsquemaDoBanco>(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
