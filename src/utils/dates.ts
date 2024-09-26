import moment from 'moment'
import 'moment-timezone'; 


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
const getTimeZone = (country) => {
  return countriesTimeZones[country] || null; 
}


const getRemainingDays = (date, countryCode = '', comparisonDate?: string) => {
  
  const dueDateOnly = date && date.includes('T') ? date.split('T')[0] : date  
  const timeZone = getTimeZone(countryCode);

  if (!timeZone) {
    const diffDate = comparisonDate ? moment(dueDateOnly).diff(comparisonDate, 'days') : moment(dueDateOnly).diff(moment().startOf('day').format('YYYY-MM-DD HH:mm'), 'days') 
    const remainingDays = date ? diffDate: 0
    return remainingDays;
  }
  
  const dateTimeZone = moment().tz(timeZone).startOf('day').format('YYYY-MM-DD HH:mm');
  const comparisonDateInTimeZone = moment.tz(comparisonDate, timeZone).format('YYYY-MM-DD');
  const finalDate = comparisonDate ? comparisonDateInTimeZone : dateTimeZone

  const remainingDays = date ? moment(dueDateOnly).diff(finalDate, 'days') : 0;
  return remainingDays;
}

const getDaysExpired = (date, countryCode = '',comparisonDate?: string) => {
  const dueDateOnly = date && date.includes('T') ? date.split('T')[0] : date  
  const timeZone = getTimeZone(countryCode);

  if (!timeZone) {
    const diffDate = comparisonDate ? moment(comparisonDate).diff(dueDateOnly, 'days') : moment(moment().startOf('day').format('YYYY-MM-DD HH:mm')).diff(dueDateOnly, 'days') 
    const remainingDays = date && date !== '' ? diffDate : 0
    return remainingDays;
  }

	const dateTimeZone = moment().tz(timeZone).startOf('day').format('YYYY-MM-DD HH:mm');
  const comparisonDateInTimeZone = moment.tz(comparisonDate, timeZone).format('YYYY-MM-DD');

  const finalDate = comparisonDate ? comparisonDateInTimeZone : dateTimeZone
  const remainingDays = date ? moment(finalDate).diff(dueDateOnly, 'days') : 0;
  return remainingDays;
}

const expirationDateWithCurrentDate = (dueDate) => {

  const dueDateObj = moment.utc(dueDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

  const currentDate = moment().startOf('day');

  return currentDate.isSameOrAfter(dueDateObj);

}


const dateFormatCsv = (date) => {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(20\d{2})$/;

  if (regex.test(date)) {
      return true;
  } else {
      return false;
  }
}

export { getRemainingDays, expirationDateWithCurrentDate, getDaysExpired, dateFormatCsv }
