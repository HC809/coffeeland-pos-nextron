import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { IGeneralInfo } from '../models/IGeneralInfo';

export type State = {
  companyInfo: IGeneralInfo;
  printerName: string;
};

export const initialState: State = {
  companyInfo: {
    rtn: '',
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  },
  printerName: '',
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
  },
});

export const selectGeneralInfo = (state: RootState) => state.generalInfo;

export const { setCompanyInfo, setPrinterName } = generalInfoSlice.actions;

export default generalInfoSlice.reducer;
