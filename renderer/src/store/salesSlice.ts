import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ISale } from '@/models/ISale';
import { SaveInvoiceResponse } from '@/models/Authentication/IPOSData';

interface CancelSale {
  uuid: string;
  reason: string;
}

interface SaleState {
  sales: ISale[];
  saleToView: ISale | null;
  saleToCancel: ISale | null;
}

const initialState: SaleState = {
  sales: [],
  saleToView: null,
  saleToCancel: null,
};

const salesSlice = createSlice({
  name: 'Sale',
  initialState,
  reducers: {
    addSale: (state, action: PayloadAction<ISale>) => {
      state.sales.push(action.payload);
    },
    updateSyncInvoices: (state, action: PayloadAction<SaveInvoiceResponse[]>) => {
      action.payload.map((item) => {
        const index = state.sales.findIndex((x) => x.uuid === item.uuid && x.orderInfo.cai === item.cai);
        if (index !== -1) state.sales[index].orderInfo.isSync = true;
      });
    },
    setSaleToView: (state, action: PayloadAction<ISale | null>) => {
      state.saleToView = action.payload;
    },
    setSaleToCancel: (state, action: PayloadAction<ISale | null>) => {
      state.saleToCancel = action.payload;
    },
    cancelSale: (state, action: PayloadAction<CancelSale>) => {
      if (state.saleToCancel) {
        const index = state.sales.findIndex((x) => x.uuid === action.payload.uuid);
        if (index !== -1) {
          state.sales[index].orderInfo.cancelled = true;
          state.sales[index].orderInfo.cancelledReason = action.payload.reason;
        }
      }
    },
    resetSales: (state, action: PayloadAction) => {
      state.sales = [];
    },
  },
});

export const selectSales = (state: RootState) => state.sale;
export const selectPendingSales = (state: RootState) => state.sale.sales.filter(sale => sale.orderInfo.isSync === false);
export const selectSaleToView = (state: RootState) => state.sale.saleToView;
export const selectSaleToCancel = (state: RootState) => state.sale.saleToCancel;
export const selectTotalCard = (state: RootState) => state.sale.sales.reduce((acc, cur) => acc + Number(cur.orderInfo.cardAmount), 0);
export const selectTotalCash = (state: RootState) => state.sale.sales.reduce((acc, cur) => acc + Number(cur.orderInfo.cashAmount), 0);
export const /* A selector that returns the total change amount of all sales. */
  selectTotalChange = (state: RootState) => state.sale.sales.reduce((acc, cur) => acc + Number(cur.orderInfo.changeAmount), 0);


export const { addSale, updateSyncInvoices, setSaleToView, setSaleToCancel, cancelSale, resetSales } = salesSlice.actions;

export default salesSlice.reducer;
