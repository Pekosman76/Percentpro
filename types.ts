
export type CalculationResult = {
  value: number;
  formatted: string;
} | null;

export enum CalcType {
  PERCENT_OF_VALUE = 'PERCENT_OF_VALUE',
  VALUE_AS_PERCENT = 'VALUE_AS_PERCENT',
  INCREASE_DECREASE = 'INCREASE_DECREASE',
  VARIATION_RATE = 'VARIATION_RATE'
}
