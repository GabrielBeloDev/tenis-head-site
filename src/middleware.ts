import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { lerConfiguracao } from '@/infra/supabase/configuracao';

export async function middleware(requisicao: NextRequest) {
  const configuracao = lerConfiguracao();
  if (configuracao === null) return NextResponse.next();

  const resposta = NextResponse.next({ request: requisicao });

  const supabase = createServerClient(
    configuracao.NEXT_PUBLIC_SUPABASE_URL,
    configuracao.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => requisicao.cookies.getAll(),
        setAll: (aDefinir) => {
          aDefinir.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();
  const indoParaLogin = requisicao.nextUrl.pathname === '/admin/entrar';

  if (data.user === null && !indoParaLogin) {
    return NextResponse.redirect(new URL('/admin/entrar', requisicao.url));
  }

  if (data.user !== null && indoParaLogin) {
    return NextResponse.redirect(new URL('/admin', requisicao.url));
  }

  return resposta;
}

export const config = { matcher: ['/admin/:path*'] };
