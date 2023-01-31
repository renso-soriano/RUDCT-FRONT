// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: "https://localhost:5001/Api/",
  appName: "Registro Único de Demandas Ciudadanas Territoriales",
  appShortName: "RUDCT",
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
    accessToken:'pk.eyJ1Ijoic3RvcmVwb2ludGRlbW8iLCJhIjoiY2swOGZxMHAwMDFzdTNucGUzcmpma3hncCJ9.FjU11uGJo7etP_lWVAoxsg'
  },
  InicializarMapa: {
    // coordenadaX:  18.882845408575886,
    // coordenadaY:  -70.397902,

    coordenadaX:18.842270,
    coordenadaY: -69.845067,


    //accessToken: 'pk.eyJ1IjoiYnJhc2thbSIsImEiOiJja3NqcXBzbWoyZ3ZvMm5ybzA4N2dzaDR6In0.RUAYJFnNgOnn80wXkrV9ZA',
    accessToken:'pk.eyJ1Ijoic3RvcmVwb2ludGRlbW8iLCJhIjoiY2swOGZxMHAwMDFzdTNucGUzcmpma3hncCJ9.FjU11uGJo7etP_lWVAoxsg'

  },
};
