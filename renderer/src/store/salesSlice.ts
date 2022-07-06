import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder, IOrderAmounts, IOrderDetail } from '../models/INewOrder';
import { RootState } from './store';
import { ISale } from '@/models/ISale';

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
    resetSales: (state,) => {
      state.sales = initialState.sales;
    },
  },
});

export const selectSales = (state: RootState) => state.sale;

export const { addSale, resetSales } = salesSlice.actions;

export default salesSlice.reducer;
