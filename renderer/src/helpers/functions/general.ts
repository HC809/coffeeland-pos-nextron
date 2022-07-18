import moment from 'moment';
import 'moment/locale/es';

export const toShortDate = (date: Date) => {
  const auxDate = new Date(date);
  return moment(auxDate).format('DD/MM/YYYY');
};

export const hourFormat = (fecha: Date) => {
  let initDate = moment(fecha);

  return `${initDate.format('h:mm:ss a')}`;
};

export const formatNumber = (number: number) =>
  '' + number.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

export function round(num: number) {
  var m = Number((Math.abs(num) * 100).toPrecision(15));
  return Math.round(m) / 100 * Math.sign(num);
}

export function formatLeadingZeros(number: number, many: number) {
  return ('0'.repeat(many) + number).slice(-many);
}

export function formatInvoice(establishment: number, documentType: number, invoicePoint: number, invoiceNumber: number) {
  const establishmentString = formatLeadingZeros(establishment, 3);
  const documentTypeString = formatLeadingZeros(documentType, 3);
  const invoicePointString = formatLeadingZeros(invoicePoint, 2);
  const invoiceNumberString = formatLeadingZeros(invoiceNumber, 8);

  return `${establishmentString}-${documentTypeString}-${invoicePointString}-${invoiceNumberString}`;
}


