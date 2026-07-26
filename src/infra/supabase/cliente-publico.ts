import { createClient } from '@supabase/supabase-js';
import { exigirConfiguracao } from './configuracao';
import type { EsquemaDoBanco } from './cliente';

// Sem cookies de propósito: ler a vitrine não depende de sessão, e usar o cliente com
// cookies tornaria a home dinâmica, renderizando de novo a cada visita.
export function clientePublico() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = exigirConfiguracao();

  return createClient<EsquemaDoBanco>(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
