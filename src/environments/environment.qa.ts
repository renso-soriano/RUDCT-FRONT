export const environment = {
  production: true,
  //apiUrl: "http://apidemandas.economia.local/api/",
  apiUrl: "http://apidemandas.economia.local/api/",
  appName: "Registro Único de Demandas Ciudadanas Territoriales",
  appShortName: "RUDCT",
  allowedMimeTypes: [
    'application/pdf',
   // 'application/msword',
    //'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //'image/jpeg',
    //'image/png'
  ],
  allowedFileTypes: [
   // "image",
    "pdf",
   // "doc",
   // "docx",
  //  "xlsx",
   // "xls"
   ],
  appMaxFileSize: 5, // Tamaño en MB
  appMaxFileCount: 10,
  appStartYear: 2016,
  specialChars: {
    "Á": "A",
    "É": "E",
    "Í": "I",
    "Ó": "O",
    "Ú": "U",
    "á": "a",
    "é": "e",
    "í": "i",
    "ó": "o",
    "ú": "u",
    "ñ": "n",
    "Ñ": "N"
  },
  mapbox: {
    //accessToken: 'pk.eyJ1IjoiYnJhc2thbSIsImEiOiJja3NqcXBzbWoyZ3ZvMm5ybzA4N2dzaDR6In0.RUAYJFnNgOnn80wXkrV9ZA',
    accessToken: 'pk.eyJ1Ijoic3RvcmVwb2ludGRlbW8iLCJhIjoiY2swOGZxMHAwMDFzdTNucGUzcmpma3hncCJ9.FjU11uGJo7etP_lWVAoxsg'

  },
  InicializarMapa: {
    coordenadaX: 18.842270,
    coordenadaY: -69.845067,
    //accessToken: 'pk.eyJ1IjoiYnJhc2thbSIsImEiOiJja3NqcXBzbWoyZ3ZvMm5ybzA4N2dzaDR6In0.RUAYJFnNgOnn80wXkrV9ZA',
    accessToken: 'pk.eyJ1Ijoic3RvcmVwb2ludGRlbW8iLCJhIjoiY2swOGZxMHAwMDFzdTNucGUzcmpma3hncCJ9.FjU11uGJo7etP_lWVAoxsg'

  },
};
