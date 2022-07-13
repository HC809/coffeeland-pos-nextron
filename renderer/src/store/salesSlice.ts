import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ISale } from '@/models/ISale';
import { SaveInvoiceResponse } from '@/models/Authentication/IPOSData';

interface SaleState {
  sales: ISale[];
}

const initialState: SaleState = {
  sales: [],
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
    resetSales: (state, action: PayloadAction) => {
      state.sales = [];
    },
  },
});

export const selectSales = (state: RootState) => state.sale;
export const selectPendingSales = (state: RootState) => state.sale.sales.filter(sale => sale.orderInfo.isSync === false);

export const { addSale, updateSyncInvoices, resetSales } = salesSlice.actions;

export default salesSlice.reducer;
