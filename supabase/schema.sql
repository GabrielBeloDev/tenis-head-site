-- Rode este arquivo no SQL Editor do Supabase para preparar o banco do painel.
--
-- Depois, dois passos obrigatórios:
--   1. Authentication > Providers > desligue "Allow new users to sign up".
--   2. Crie o usuário do dono e rode:
--      insert into public.administradores (id) values ('<uuid-do-usuario>');
--
-- Sem isso, "authenticated" no Supabase significa qualquer pessoa que consiga criar
-- uma conta no projeto, e o ref do projeto é público nas URLs das fotos da vitrine.

create table if not exists public.administradores (
  id uuid primary key references auth.users (id) on delete cascade
);

alter table public.administradores enable row level security;

create policy "administrador vê a si mesmo"
  on public.administradores for select
  to authenticated
  using (id = auth.uid());

-- Fora do schema public para não virar endpoint RPC: o PostgREST só expõe o public.
create schema if not exists privado;

create function privado.eh_administrador()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.administradores where id = auth.uid());
$$;

revoke all on function privado.eh_administrador() from public;
grant usage on schema privado to authenticated;
grant execute on function privado.eh_administrador() to authenticated;

create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  marca text not null,
  categoria text not null check (categoria in ('lifestyle', 'corrida', 'campo', 'treino', 'casual')),
  imagem text not null,
  destaque boolean not null default true,
  ordem integer not null default 1,
  criado_em timestamptz not null default now()
);

create index if not exists produtos_ordem_idx on public.produtos (ordem);

alter table public.produtos enable row level security;

create policy "vitrine é pública"
  on public.produtos for select
  to anon, authenticated
  using (true);

create policy "só administrador escreve"
  on public.produtos for all
  to authenticated
  using (privado.eh_administrador())
  with check (privado.eh_administrador());

insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

-- Bucket público serve por URL direta. Uma policy de select aqui deixaria listar o bucket inteiro.
create policy "só administrador envia foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'produtos' and privado.eh_administrador());

create policy "só administrador remove foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'produtos' and privado.eh_administrador());
