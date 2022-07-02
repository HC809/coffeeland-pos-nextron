import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { IGeneralInfo } from '../models/IGeneralInfo';

export type State = {
  companyInfo: IGeneralInfo;
};

export const initialState: State = {
  companyInfo: {
    rtn: '',
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  },
};

export const generalInfoSlice = createSlice({
  name: 'generalInfo',
  initialState,
  reducers: {
    setCompanyInfo: (state, action: PayloadAction<IGeneralInfo>) => {
      state.companyInfo = action.payload;
    },
  },
});

export const selectGeneralInfo = (state: RootState) => state.generalInfo;

export const { setCompanyInfo } = generalInfoSlice.actions;

export default generalInfoSlice.reducer;
