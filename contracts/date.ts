export interface DateContract {
  addDays(date: Date, amount: number): Promise<Date>;
}
