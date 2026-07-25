import { z } from 'zod';

const esquema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type ConfiguracaoSupabase = z.infer<typeof esquema>;

export function lerConfiguracao(): ConfiguracaoSupabase | null {
  const resultado = esquema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  return resultado.success ? resultado.data : null;
}

export function exigirConfiguracao(): ConfiguracaoSupabase {
  const configuracao = lerConfiguracao();

  if (configuracao === null) {
    throw new Error(
      'Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  return configuracao;
}
