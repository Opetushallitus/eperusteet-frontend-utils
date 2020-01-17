export const aikataulutapahtuma = {
  luominen: 'luominen',
  julkaisu: 'julkaisu',
  tavoite: 'tavoite',
};

export const aikataulutapahtumaSort = {
  'luominen': 1,
  'julkaisu': 2,
  'tavoite': 3,
};

export function aikatauluTapahtumaSort(aikataulu: any) {
  return aikataulutapahtumaSort[aikataulu.tapahtuma];
}

export function aikatauluTapahtumapaivaSort(aikataulu: any) {
  return aikataulu.tapahtumapaiva;
}
