-- Rode este arquivo no SQL Editor do Supabase para preparar o banco do painel.

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

create policy "só quem está autenticado escreve"
  on public.produtos for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy "fotos são públicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'produtos');

create policy "só quem está autenticado envia foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'produtos');

create policy "só quem está autenticado remove foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'produtos');
