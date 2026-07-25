import { PROPORCAO_DA_FOTO } from '@/core/produtos/produto';

const QUALIDADE = 0.82;

export type PosicaoDoCorte = 'centro' | 'base';

function areaDeCorte(largura: number, altura: number, posicao: PosicaoDoCorte) {
  const proporcaoAlvo = PROPORCAO_DA_FOTO.largura / PROPORCAO_DA_FOTO.altura;
  const proporcaoOrigem = largura / altura;

  if (proporcaoOrigem > proporcaoAlvo) {
    const larguraCortada = altura * proporcaoAlvo;
    return { x: (largura - larguraCortada) / 2, y: 0, largura: larguraCortada, altura };
  }

  const alturaCortada = largura / proporcaoAlvo;
  const sobra = altura - alturaCortada;
  return { x: 0, y: posicao === 'base' ? sobra * 0.78 : sobra / 2, largura, altura: alturaCortada };
}

export async function recortarParaVitrine(arquivo: File, posicao: PosicaoDoCorte = 'centro'): Promise<File> {
  const bitmap = await createImageBitmap(arquivo);
  const corte = areaDeCorte(bitmap.width, bitmap.height, posicao);

  const tela = document.createElement('canvas');
  tela.width = PROPORCAO_DA_FOTO.largura;
  tela.height = PROPORCAO_DA_FOTO.altura;

  const contexto = tela.getContext('2d');
  if (contexto === null) throw new Error('Não foi possível preparar a imagem para envio');

  contexto.drawImage(
    bitmap,
    corte.x, corte.y, corte.largura, corte.altura,
    0, 0, tela.width, tela.height,
  );
  bitmap.close();

  const conteudo = await new Promise<Blob | null>((resolver) =>
    tela.toBlob(resolver, 'image/jpeg', QUALIDADE),
  );
  if (conteudo === null) throw new Error('Não foi possível preparar a imagem para envio');

  const nome = arquivo.name.replace(/\.[^.]+$/, '') || 'foto';
  return new File([conteudo], `${nome}.jpg`, { type: 'image/jpeg' });
}
