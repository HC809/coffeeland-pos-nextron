export interface IInvoiceRange {
  id: number;
  cai: string;
  startNumber: number;
  endNumber: number;
  currentNumber: number;
  current_number: number;
  limitDate: Date | null;
}
