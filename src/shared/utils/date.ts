import { startOfMonth, addMonths, isBefore, isAfter } from 'date-fns';

export class DateUtils {
  static getMonthStart(date: Date = new Date()): Date {
    return startOfMonth(date);
  }

  static getNextMonthStart(date: Date = new Date()): Date {
    return startOfMonth(addMonths(date, 1));
  }

  static isExpired(date: Date): boolean {
    return isBefore(date, new Date());
  }

  static isActive(startDate: Date, endDate: Date): boolean {
    const now = new Date();
    return !isBefore(now, startDate) && !isAfter(now, endDate);
  }
}
