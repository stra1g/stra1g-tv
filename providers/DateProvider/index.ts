import { DateContract } from 'Contracts/date';
import { add } from 'date-fns';

export class DateProvider implements DateContract {
  public async addDays(date: Date, amount: number): Promise<Date> {
    return add(date, { days: amount });
  }
}
