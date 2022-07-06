import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';
import { IInvoicePoint } from '../models/IInvoicePoint';
import { IInvoiceRange } from '../models/IInvoiceRange';

export type State = {
  invoicePoint: IInvoicePoint;
  activeInvoiceRange: IInvoiceRange;
  pendingInvoiceRange: IInvoiceRange | null;
};

const initialState: State = {
  invoicePoint: {
    id: 0,
    name: '',
    number: 0,
    establishment: 0,
    documentType: 0,
  },
  activeInvoiceRange: {
    id: 0,
    cai: '',
    startNumber: 0,
    endNumber: 0,
    current_number: 0,
    currentNumber: 0,
    limitDate: null,
  },
  pendingInvoiceRange: null,
};

export const taxInfoSlice = createSlice({
  name: 'taxInfo',
  initialState,
  reducers: {
    setTaxInfo: (state, action: PayloadAction<State>) => {
      state.invoicePoint = action.payload.invoicePoint;
      state.activeInvoiceRange = action.payload.activeInvoiceRange;
      state.pendingInvoiceRange = action.payload.pendingInvoiceRange;
    },
    incrementCurrentNumberRange: (state, action: PayloadAction<number>) => {
      if (state.activeInvoiceRange.id === action.payload) {
        state.activeInvoiceRange.currentNumber =
          state.activeInvoiceRange.currentNumber + 1;
      }

      if (
        state.pendingInvoiceRange &&
        state.pendingInvoiceRange.id === action.payload
      ) {
        state.pendingInvoiceRange.currentNumber =
          state.pendingInvoiceRange.currentNumber + 1;
      }
    },
    removeTaxInfo: (state) => {
      state.invoicePoint = initialState.invoicePoint;
      state.activeInvoiceRange = initialState.activeInvoiceRange;
      state.pendingInvoiceRange = initialState.pendingInvoiceRange;
    },
  },
});

export const selectTaxInfo = (state: RootState) => state.taxInfo;

export const { setTaxInfo, removeTaxInfo, incrementCurrentNumberRange } =
  taxInfoSlice.actions;

export default taxInfoSlice.reducer;
