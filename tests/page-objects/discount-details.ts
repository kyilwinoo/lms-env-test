import { Page, expect } from '@playwright/test';
import { discountLocators } from '../discounts/discount-locators';

export class DiscountDetails {
    constructor(
        public discountID: string,
        public discountName: string,
        public discountAction: string
    ) { }
} 