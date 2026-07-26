import { FormularioDeLogin } from '@/ui/admin/formulario-de-login';

export const metadata = { title: 'Entrar · Tênis Head', robots: { index: false } };

export default function Entrar() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-titulo text-3xl uppercase">Painel da vitrine</h1>
      <p className="mt-2 text-creme/60">Entre para trocar as fotos e os modelos que aparecem no site.</p>
      <FormularioDeLogin />
    </main>
  );
}
