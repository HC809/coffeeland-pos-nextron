import { app, screen, ipcMain } from 'electron';
import serve from 'electron-serve';
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} = require("electron-devtools-installer");
import { createWindow } from './helpers';
const { PosPrinter } = require('electron-pos-printer');
import process from 'node:process';

process.setMaxListeners(0);

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: screen.getPrimaryDisplay().workArea.width,
    height: screen.getPrimaryDisplay().workArea.height,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./index.html');
  } else {
    console.log('development mode');
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);

    await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));

    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

//PRINT TEST
ipcMain.handle('print-test', async (event, arg) => {

  const printerName = arg.printerName;

  const printerOptions = {
    preview: false, // preview in window or print
    width: '270px', //  width of content body
    margin: '0 0 0 0', // margin of content body
    copies: 1, // Number of copies to print
    printerName: printerName, // printerName: string
    timeOutPerLine: 5000,
    silent: true,
  };

  const data = [
    {
      type: 'text',
      value: "Prueba de impresion...",
      style: `text-align:center;`,
      css: { 'font-weight': '700', 'font-size': '20px' },
    },
  ];

  return PosPrinter.print(data, printerOptions)
    .then(() => {
      return {
        success: true,
        error: null,
        message: 'Factura impresa correctamente!',
      };
    })
    .catch((err) => {
      return {
        success: false,
        message: 'Error: Verifique que la impresora este conectada correctamente, que el nombre sea correcto y que tenga suficiente papel.',
      };
    });
});

//PRINT INVOICE
ipcMain.handle('print-invoice', async (event, arg) => {
  const printerName = arg.printerName;
  const companyInfo = arg.companyInfo;
  const newOrderInfo = arg.newOrderInfo;
  const newOrderAmounts = arg.newOrderAmountList;
  const newOrderDetail = arg.newOrderProductDetail;
  const invoiceDate = arg.invoiceDate;
  const invoiceNumber = arg.invoiceNumber;
  const limitDate = arg.limitDate;
  const lettersAmount = arg.lettersAmount;
  const cash = arg.cash;
  const card = arg.card;
  const change = arg.change;

  const printerOptions = {
    preview: false, // preview in window or print
    width: '270px', //  width of content body
    margin: '0 0 0 0', // margin of content body
    copies: 1, // Number of copies to print
    printerName: printerName, // printerName: string
    timeOutPerLine: 5000,
    silent: true,
  };

  const data = [
    {
      type: 'text',
      value: companyInfo.name,
      style: `text-align:center;`,
      css: { 'font-weight': '700', 'font-size': '20px' },
    },
    {
      type: 'text',
      value: companyInfo.address,
      style: `text-align:center;`,
      css: { 'font-size': '14px' },
    },
    {
      type: 'text',
      value: `Correo: ${companyInfo.email}`,
      style: `text-align:center;`,
      css: { 'font-size': '14px' },
    },
    {
      type: 'text',
      value: `RTN: ${companyInfo.rtn}`,
      style: `text-align:center;`,
      css: { 'font-size': '14px' },
    },
    {
      type: 'text',
      value: `TEL: ${companyInfo.phoneNumber}`,
      style: `text-align:center;`,
      css: { 'font-size': '14px' },
    },
    {
      type: 'text',
      value: `C.A.I.: ${newOrderInfo?.cai}`,
      style: `text-align:left;`,
      css: { 'font-size': '12PX', 'padding-top': '10px' },
    },
    {
      type: 'text',
      value: `${invoiceDate}`,
      style: `text-align:left;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `FACTRUA: ${invoiceNumber}`,
      style: `text-align:left;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `CLIENTE: ${newOrderInfo?.customerName}`,
      style: `text-align:left;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `RTN: ${newOrderInfo?.rtn}`,
      style: `text-align:left;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `NO. O/CO EXENTA:`,
      style: `text-align:left;`,
      css: { 'font-size': '1412PXpx' },
    },
    {
      type: 'text',
      value: `NO. REG. EXONERADO:`,
      style: `text-align:left;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `NO. REG. SAG:`,
      style: `text-align:left;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'table',
      style: 'border: 1px solid #ddd',
      tableHeader: ['UDS', 'DESCRIPCION', 'PRECIO'],
      tableBody: newOrderDetail.map((prod) => {
        return [prod.quantity, prod.productName, prod.total];
      }),
      tableBodyStyle: 'border: 0.5px solid #ddd',
    },
    {
      type: 'text',
      value: `Subtotal:  L ${newOrderAmounts.subtotal}`,
      style: `text-align:right;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Importe Exento:  L ${newOrderAmounts.totalExempt}`,
      style: `text-align:right;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Importe Exonerado:  L ${newOrderAmounts.totalExonerated}`,
      style: `text-align:right;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Importe Gravado 15%:  L ${newOrderAmounts.taxableAmount15}`,
      style: `text-align:right;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Importe Gravado 18%:  L ${newOrderAmounts.taxableAmount18}`,
      style: `text-align:right;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Impuestos del 15%:  L ${newOrderAmounts.totalTax15}`,
      style: `text-align:right;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Impuestos del 18%:  L ${newOrderAmounts.totalTax18}`,
      style: `text-align:right;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Total Impuestos:  L ${newOrderAmounts.totalTax}`,
      style: `text-align:right;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `TOTAL A PAGAR:  L ${newOrderAmounts.total}`,
      style: `text-align:right;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `SON: (${lettersAmount})`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX', 'padding-top': '10px' },
    },
    {
      type: 'text',
      value: `*** GRACIAS POR SU VISITA ***`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX', 'padding-top': '10px' },
    },
    {
      type: 'text',
      value: `Efectivo: ${cash}`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX', 'padding-top': '10px' },
    },
    {
      type: 'text',
      value: `Cambio: ${change}`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Tarjeta: ${card}`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `RANGO AUTORIZADO:`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX', 'padding-top': '10px' },
    },
    {
      type: 'text',
      value: `${newOrderInfo.range}`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `FECHA LIMITE EMISION: ${limitDate}`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Exento=E   Gravado=G   Original: Cliente`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX' },
    },
    {
      type: 'text',
      value: `Copia: Obligado Tributario Emisor`,
      style: `text-align:center;`,
      css: { 'font-size': '12PX' },
    },
  ];

  return PosPrinter.print(data, printerOptions)
    .then(() => {
      return {
        success: true,
        error: null,
        message: 'Factura impresa correctamente!',
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        message: 'Error: Verifique que la impresora este conectada correctamente, que el nombre sea correcto y que tenga suficiente papel.',
      };
    });
});

