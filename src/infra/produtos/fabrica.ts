import type { RepositorioDeProdutos } from '@/core/produtos/repositorio-de-produtos';
import { lerConfiguracao } from '../supabase/configuracao';
import { criarRepositorioSupabase } from '../supabase/repositorio-de-produtos';
import { criarRepositorioEmMemoria } from './repositorio-em-memoria';

export function repositorioDeProdutos(): RepositorioDeProdutos {
  return lerConfiguracao() === null ? criarRepositorioEmMemoria() : criarRepositorioSupabase();
}

export function supabaseDisponivel(): boolean {
  return lerConfiguracao() !== null;
}
