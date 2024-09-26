export const isDev = () => {
  return process.env.NEXT_PUBLIC_APP_IS_DEV === 'true'
}


const countriesSpanishCode = [
  'AR', // Argentina
  'BO', // Bolivia
  'CL', // Chile
  'CO', // Colombia
  'CR', // Costa Rica
  'CU', // Cuba
  'DO', // República Dominicana
  'EC', // Ecuador
  'SV', // El Salvador
  'ES', // España
  'GT', // Guatemala
  'HN', // Honduras
  'MX', // México
  'NI', // Nicaragua
  'PA', // Panamá
  'PY', // Paraguay
  'PE', // Perú
  'PR', // Puerto Rico
  'UY', // Uruguay
  'VE'  // Venezuela
];


const countriesTimeZones = {
  'AR': 'America/Argentina/Buenos_Aires', // Argentina
  'BO': 'America/La_Paz', // Bolivia
  'CL': 'America/Santiago', // Chile
  'CO': 'America/Bogota', // Colombia
  'CR': 'America/Costa_Rica', // Costa Rica
  'CU': 'America/Havana', // Cuba
  'DO': 'America/Santo_Domingo', // República Dominicana
  'EC': 'America/Guayaquil', // Ecuador
  'SV': 'America/El_Salvador', // El Salvador
  'ES': 'Europe/Madrid', // España
  'GT': 'America/Guatemala', // Guatemala
  'HN': 'America/Tegucigalpa', // Honduras
  'MX': 'America/Mexico_City', // México
  'NI': 'America/Managua', // Nicaragua
  'PA': 'America/Panama', // Panamá
  'PY': 'America/Asuncion', // Paraguay
  'PE': 'America/Lima', // Perú
  'PR': 'America/Puerto_Rico', // Puerto Rico
  'UY': 'America/Montevideo', // Uruguay
  'VE': 'America/Caracas', // Venezuela
  'US': 'EST'
};


export const formatCurrency = (country, value) => {
  let locale;
  let currency;
  
  switch (country) {
      case 'AR': locale = 'es-AR'; currency = 'ARS'; break;
      case 'BO': locale = 'es-BO'; currency = 'BOB'; break;
      case 'CL': locale = 'es-CL'; currency = 'CLP'; break;
      case 'CO': locale = 'es-CO'; currency = 'COP'; break;
      case 'CR': locale = 'es-CR'; currency = 'CRC'; break;
      case 'CU': locale = 'es-CU'; currency = 'CUP'; break;
      case 'DO': locale = 'es-DO'; currency = 'DOP'; break;
      case 'EC': locale = 'es-EC'; currency = 'USD'; break; // Ecuador usa USD
      case 'SV': locale = 'es-SV'; currency = 'USD'; break; // El Salvador usa USD
      case 'ES': locale = 'es-ES'; currency = 'EUR'; break;
      case 'GT': locale = 'es-GT'; currency = 'GTQ'; break;
      case 'HN': locale = 'es-HN'; currency = 'HNL'; break;
      case 'MX': locale = 'es-MX'; currency = 'MXN'; break;
      case 'NI': locale = 'es-NI'; currency = 'NIO'; break;
      case 'PA': locale = 'es-PA'; currency = 'PAB'; break;
      case 'PY': locale = 'es-PY'; currency = 'PYG'; break;
      case 'PE': locale = 'es-PE'; currency = 'PEN'; break;
      case 'PR': locale = 'es-PR'; currency = 'USD'; break; // Puerto Rico usa USD
      case 'UY': locale = 'es-UY'; currency = 'UYU'; break;
      case 'VE': locale = 'es-VE'; currency = 'VES'; break;
      case 'US': locale = 'en-US'; currency = 'USD'; break;
      default: locale = 'en-US'; currency = 'USD'; break;
  }

  return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(value);
};


export const getTimeZone = (country) => {
  return countriesTimeZones[country] || null; 
}

export const isSpanishCountryCode = (code) => {
  return countriesSpanishCode.includes(code);
}

export const taxesMX = () => {
  return [
    {
      "id": "001",
      "descripcion": "ISR",
      "retencion": "Si",
      "traslado": "No",
      "localOFederal": "Federal",
      "entidadEnLaQueAplica": ""
    },
    {
      "id": "002",
      "descripcion": "IVA",
      "retencion": "Si",
      "traslado": "Si",
      "localOFederal": "Federal",
      "entidadEnLaQueAplica": ""
    },
    {
      "id": "003",
      "descripcion": "IEPS",
      "retencion": "Si",
      "traslado": "Si",
      "localOFederal": "Federal",
      "entidadEnLaQueAplica": ""
    }
  ]
}

export const findTaxeMX = (id) => taxesMX().find((tax) => tax.id === id);