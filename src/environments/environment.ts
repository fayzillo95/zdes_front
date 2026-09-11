/// Production sozlamasi — `ng build` (standart konfiguratsiya) shuni oladi.
///
/// `environment.development.ts` esa `ng serve` / `--configuration development`
/// paytida buning o'rniga qo'yiladi (angular.json → fileReplacements).
export const environment = {
  production: true,
  apiUrl: 'https://zdes-backend.safira.uz/api/v1',
};
