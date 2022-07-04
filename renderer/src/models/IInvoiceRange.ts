export interface IInvoiceRange {
  id: number;
  cai: string;
  startNumber: number;
  endNumber: number;
  actualNumber: number;
  current_number: number;
  limitDate: Date | null;
}
