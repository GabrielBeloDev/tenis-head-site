import { LOJA } from '@/core/loja/loja';

const PASSOS = [
  {
    titulo: 'Escolha o par',
    texto: 'Aqui na vitrine ou no Instagram, onde fica o estoque completo e as grades novas.',
  },
  {
    titulo: 'Chama no WhatsApp',
    texto: 'Manda o print do modelo que você quer. Você fala com quem vende, não com robô.',
  },
  {
    titulo: 'Confirma tudo',
    texto: 'Tamanho disponível, foto real do par e o valor já com o desconto que couber.',
  },
  {
    titulo: 'Retira ou recebe',
    texto: `Retira na loja, na ${LOJA.endereco.rua}, ou combina o envio direto na conversa.`,
  },
] as const;

export function ComoComprar() {
  return (
    <section id="como-comprar" className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-8 lg:px-12 lg:pt-22">
      <p className="rotulo-secao">Como comprar</p>
      <h2 className="titulo-display mt-3 mb-8 text-[clamp(2.4rem,6vw,4.25rem)]">Simples assim</h2>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PASSOS.map((passo, indice) => (
          <li key={passo.titulo} className="rounded-2xl border border-creme/10 bg-carvao p-6">
            <span className="font-titulo text-[2.1rem] text-vermelho-claro">
              {String(indice + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 text-[17px] font-bold">{passo.titulo}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-creme/65">{passo.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
