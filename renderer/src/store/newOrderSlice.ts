import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder, IOrderAmounts, IOrderDetail } from '../models/INewOrder';
import { RootState } from './store';
import { calculateTotalOrderAmounts, decrementProductQuantity, incremenetProductQuantity } from '@/services/NewOrderService';

interface NewOrderType {
  orderTypeCode: string;
  customerName: string;
  rtn: string;
  ticketNumber: number;
}

interface NewOrderStartTaxInfo {
  invoicePointId: number,
  invoiceRangeId: number,
  cai: string;
  establishmentNumber: number,
  documentTypeNumber: number,
  invoicePointNumber: number,
  invoiceNumber: number;
  limitDate: Date;
  range: string;
  orderNumber: string;
  orderTypeCode: string;
}

interface NewOrderState {
  newOrderInfo: IOrder;
  newOrderAmounts: IOrderAmounts;
  newOrderDetail: IOrderDetail[];
}

const initialState: NewOrderState = {
  newOrderInfo: {
    customerName: 'Consumidor Final',
    rtn: '',
    cai: '',
    invoicePointId: 0,
    invoiceRangeId: 0,
    establishmentNumber: 0,
    documentTypeNumber: 0,
    invoicePointNumber: 0,
    invoiceNumber: 0,
    limitDate: null,
    range: '',
    orderTypeCode: '',
    ticketNumber: null,
    started: false,
    finished: false,
    date: null,
    cashAmount: 0,
    cardAmount: 0,
    changeAmount: 0,
    orderNumber: '',
  },
  newOrderAmounts: {
    subtotal: 0,
    totalDiscount: 0,
    totalTax15: 0,
    totalTax18: 0,
    totalExempt: 0,
    totalExonerated: 0,
    taxableAmountDiscount: 0,
    taxableAmount15: 0,
    taxableAmount18: 0,
    totalTax: 0,
    total: 0,
  },
  newOrderDetail: [],
};


const newOrderSlice = createSlice({
  name: 'NewOrder',
  initialState,
  reducers: {
    setNewOrderStartTaxInfo: (state, action: PayloadAction<NewOrderStartTaxInfo>) => {
      state.newOrderInfo.invoicePointId = action.payload.invoicePointId;
      state.newOrderInfo.invoiceRangeId = action.payload.invoiceRangeId;
      state.newOrderInfo.cai = action.payload.cai;
      state.newOrderInfo.establishmentNumber = action.payload.establishmentNumber;
      state.newOrderInfo.documentTypeNumber = action.payload.documentTypeNumber;
      state.newOrderInfo.invoicePointNumber = action.payload.invoicePointNumber;
      state.newOrderInfo.invoiceNumber = action.payload.invoiceNumber;
      state.newOrderInfo.limitDate = action.payload.limitDate;
      state.newOrderInfo.range = action.payload.range;
      state.newOrderInfo.orderNumber = action.payload.orderNumber;
      state.newOrderInfo.orderTypeCode = action.payload.orderTypeCode;

      state.newOrderInfo.started = true;
    },
    setNewOrderType: (state, action: PayloadAction<NewOrderType>) => {
      state.newOrderInfo.orderTypeCode = action.payload.orderTypeCode;
      state.newOrderInfo.customerName = action.payload.customerName;
      state.newOrderInfo.rtn = action.payload.rtn;
      state.newOrderInfo.ticketNumber = action.payload.ticketNumber;

      state.newOrderInfo.started = true;
    },
    cancelNewOrder: (state) => {
      state.newOrderInfo = initialState.newOrderInfo;
      state.newOrderAmounts = initialState.newOrderAmounts;
      state.newOrderDetail = initialState.newOrderDetail;
    },
    addProductToNewOrder: (state, action: PayloadAction<IOrderDetail>) => {
      state.newOrderDetail.push(action.payload);
      state.newOrderAmounts = calculateTotalOrderAmounts(state.newOrderDetail);
    },
    removeProductFromNewOrder: (state, action: PayloadAction<number>) => {
      const newArray = state.newOrderDetail.filter(
        (item: IOrderDetail) => item.productId !== action.payload
      );
      state.newOrderDetail = newArray;
      state.newOrderAmounts = calculateTotalOrderAmounts(newArray);
    },
    incremenetProductQuantityFromNewOrder: (
      state,
      action: PayloadAction<IOrderDetail>
    ) => {
      let itemIndex = state.newOrderDetail.findIndex(
        (item: IOrderDetail) => item.productId === action.payload.productId
      );
      if (itemIndex !== -1)
        state.newOrderDetail[itemIndex] = incremenetProductQuantity(
          action.payload
        );

      state.newOrderAmounts = calculateTotalOrderAmounts(state.newOrderDetail);
    },
    decrementProductQuantityFromNewOrder: (
      state,
      action: PayloadAction<IOrderDetail>
    ) => {
      let item = state.newOrderDetail.find(
        (prod: IOrderDetail) => prod.productId === action.payload.productId
      );
      if (item?.quantity === 1) {
        removeProductFromNewOrder(item.productId);
      } else {
        let itemIndex = state.newOrderDetail.findIndex(
          (item: IOrderDetail) => item.productId === action.payload.productId
        );
        if (itemIndex !== -1)
          state.newOrderDetail[itemIndex] = decrementProductQuantity(
            action.payload
          );
      }

      state.newOrderAmounts = calculateTotalOrderAmounts(state.newOrderDetail);
    },
  },
});

export const selectNewOrder = (state: RootState) => state.newOrder;
export const selectNewOrderDetailForInvoice = (state: RootState) =>
  state.newOrder.newOrderDetail.map((item) => {
    return {
      productName: item.productName,
      sellingPrice: item.sellingPrice,
      priceBeforeTax: item.priceBeforeTax,
      quantity: item.quantity,
      taxAmount: item.taxAmount,
      subtotal: item.subtotal,
      total: item.total,
    };
  });

export const {
  setNewOrderType,
  setNewOrderStartTaxInfo,
  cancelNewOrder,
  addProductToNewOrder,
  removeProductFromNewOrder,
  incremenetProductQuantityFromNewOrder,
  decrementProductQuantityFromNewOrder,
} = newOrderSlice.actions;

export default newOrderSlice.reducer;
