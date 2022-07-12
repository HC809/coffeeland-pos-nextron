import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { IGeneralInfo } from '../models/IGeneralInfo';
import { IOrderType } from '@/models/IOrderType';

export type State = {
  companyInfo: IGeneralInfo;
  printerName: string;
  orderTypes: IOrderType[];
};

export const initialState: State = {
  companyInfo: {
    rtn: '',
    name: '',
    commercialName: '',
    email: '',
    phoneNumber: '',
    address: '',
    invoiceComment: '',
  },
  printerName: '',
  orderTypes: []
};

export const generalInfoSlice = createSlice({
  name: 'generalInfo',
  initialState,
  reducers: {
    setCompanyInfo: (state, action: PayloadAction<IGeneralInfo>) => {
      state.companyInfo = action.payload;
    },
    setPrinterName: (state, action: PayloadAction<string>) => {
      state.printerName = action.payload;
    },
    setOrderTypes: (state, action: PayloadAction<IOrderType[]>) => {
      state.orderTypes = action.payload;
    }
  },
});

export const selectGeneralInfo = (state: RootState) => state.generalInfo;

export const { setCompanyInfo, setPrinterName, setOrderTypes } = generalInfoSlice.actions;

export default generalInfoSlice.reducer;
