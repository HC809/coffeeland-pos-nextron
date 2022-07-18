import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';

interface InitShiftInfo {
  uuid: string;
  username: string;
  name: string;
  initCashFlow: number;
}

export type State = {
  uuid: string;
  username: string;
  name: string;
  isOpen: boolean;
  openDate: Date | null;
  closeDate: Date | null;
  initCashFlow: number;
  endCashFlow: number;
  totalSale: number;
  totalExpectedCash: number;
};

const initialState: State = {
  uuid: '',
  username: '',
  name: '',
  isOpen: false,
  openDate: null,
  closeDate: null,
  initCashFlow: 0,
  endCashFlow: 0,
  totalSale: 0,
  totalExpectedCash: 0,
};

export const shiftInfoSlice = createSlice({
  name: 'shiftInfo',
  initialState,
  reducers: {
    setOpenShift: (state, action: PayloadAction<InitShiftInfo>) => {
      state.uuid = action.payload.uuid;
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.initCashFlow = action.payload.initCashFlow;
      state.isOpen = true;
      state.openDate = new Date();
    },
    setCloseShift: (state) => {
      state.isOpen = false;
      state.closeDate = new Date();
    },
  },
});

export const selectShiftInfo = (state: RootState) => state.shiftInfo;

export const { setOpenShift, setCloseShift } = shiftInfoSlice.actions;

export default shiftInfoSlice.reducer;
