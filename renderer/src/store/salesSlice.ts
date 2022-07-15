import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ISale } from '@/models/ISale';
import { SaveInvoiceResponse } from '@/models/Authentication/IPOSData';

interface SaleState {
  sales: ISale[];
  saleToView: ISale | null;
}

const initialState: SaleState = {
  sales: [],
  saleToView: null,
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
        const index = state.sales.findIndex((x) => x.orderInfo.invoiceNumber === item.invoiceNumber && x.orderInfo.cai === item.cai);
        if (index !== -1) state.sales[index].orderInfo.isSync = true;
      });
    },
    setSaleToView: (state, action: PayloadAction<ISale | null>) => {
      state.saleToView = action.payload;
    },
    resetSales: (state, action: PayloadAction) => {
      state.sales = [];
    },
  },
});

export const selectSales = (state: RootState) => state.sale;
export const selectPendingSales = (state: RootState) => state.sale.sales.filter(sale => sale.orderInfo.isSync === false);
export const selectSaleToView = (state: RootState) => state.sale.saleToView;

export const { addSale, updateSyncInvoices, setSaleToView, resetSales } = salesSlice.actions;

export default salesSlice.reducer;
