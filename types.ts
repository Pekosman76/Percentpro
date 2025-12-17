
export type Precision = 0 | 1 | 2 | 3;

export enum View {
  CALCULATOR = 'CALCULATOR',
  HELP = 'HELP'
}

export type VATMode = 'HT_TO_TTC' | 'TTC_TO_HT' | 'TVA_ONLY';

export interface VATResult {
  ht: string;
  tva: string;
  ttc: string;
}
