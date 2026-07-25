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

create or replace function public.eh_administrador()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.administradores where id = auth.uid());
$$;

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
  using (public.eh_administrador())
  with check (public.eh_administrador());

insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy "fotos são públicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'produtos');

create policy "só administrador envia foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'produtos' and public.eh_administrador());

create policy "só administrador remove foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'produtos' and public.eh_administrador());
