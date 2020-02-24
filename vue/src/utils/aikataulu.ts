export const aikataulutapahtuma = Object.freeze({
  luominen: 'luominen',
  julkaisu: 'julkaisu',
  tavoite: 'tavoite',
});

export const aikataulutapahtumaSort = Object.freeze({
  'luominen': 1,
  'julkaisu': 2,
  'tavoite': 3,
});

export function aikatauluTapahtumaSort(aikataulu: any) {
  return aikataulutapahtumaSort[aikataulu.tapahtuma];
}

export function aikatauluTapahtumapaivaSort(aikataulu: any) {
  return aikataulu.tapahtumapaiva;
}
