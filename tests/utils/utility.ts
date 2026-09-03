import moment from 'moment';
import { Page, expect } from '@playwright/test';

export class Utility {
    get getDay(): string {
        return moment().format('DD');
    }
    get getMonthNumber(): string {
        return moment().format('MM');
    }
    get getMonthName(): string {
        return moment().format('MMMM');
    }
    get getYear(): string {
        return moment().format('YYYY');
    }
    get getNextDay(): string {
        // return moment().add(1, 'day').format('MM-DD');
        return moment().add(1, 'day').format('DD');
    };
    getCurrentDateFormatted(format: string = 'DD MMMM YYYY'): string {
        return moment().format(format);
    }
    async getDate(format: string = 'DD MMMM YYYY'): Promise<string> {
        return this.getCurrentDateFormatted(format);
    }
    get getTime(): string {
        return moment().format('HH:mm:ss');
    }
    getCurrentDateTimeFormatted(format: string = 'DD MMMM YYYY, HH:mm:ss'): string {
        return moment().format(format);
    }
    async getDateTime(format: string = 'DD MMMM YYYY, HH:mm:ss'): Promise<string> {
        return this.getCurrentDateTimeFormatted(format);
    }
}
