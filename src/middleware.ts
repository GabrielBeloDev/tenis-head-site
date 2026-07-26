import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { lerConfiguracao } from '@/infra/supabase/configuracao';

export async function middleware(requisicao: NextRequest) {
  const configuracao = lerConfiguracao();
  if (configuracao === null) {
    return NextResponse.redirect(new URL('/', requisicao.url));
  }

  let resposta = NextResponse.next({ request: requisicao });

  const supabase = createServerClient(
    configuracao.NEXT_PUBLIC_SUPABASE_URL,
    configuracao.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => requisicao.cookies.getAll(),
        setAll: (aDefinir) => {
          aDefinir.forEach(({ name, value }) => requisicao.cookies.set(name, value));
          resposta = NextResponse.next({ request: requisicao });
          aDefinir.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();
  const indoParaLogin = requisicao.nextUrl.pathname === '/admin/entrar';

  const destino =
    data.user === null && !indoParaLogin ? '/admin/entrar' : data.user !== null && indoParaLogin ? '/admin' : null;

  if (destino === null) return resposta;

  // A fresh redirect would drop the cookies getUser just rotated, logging the owner out.
  const redirecionamento = NextResponse.redirect(new URL(destino, requisicao.url));
  resposta.cookies.getAll().forEach((cookie) => redirecionamento.cookies.set(cookie));
  return redirecionamento;
}

export const config = { matcher: ['/admin/:path*'] };
