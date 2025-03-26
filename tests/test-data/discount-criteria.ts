import { Utility } from '../components/Locators/utility';
const util = new Utility()

// Data-driven test scenarios
export interface DiscountFormData {
    discount_type: string; // e.g. FixedAmt | Percentage
    test_description: string;
    voucher_provider_name: string;
    discount_name: string;
    voucher_title: string;
    description: string;
    terms_and_conditions: string;
    country: string;
    currencySign: string;
    discount_amount: string;
    maxiDiscountUses: {
        isLimitAvailableQty: boolean;
    };
    VoucherExpiration: {
        expiryType: string; // e.g. "No", "fromIssueDate"
        discountExpiryOn: string;
    };
    percentageFields: {
        amountVisible: boolean;
        capVisible: boolean;
    };
    minimumPurchase: boolean;
    minimum_purchase_amount?: string;
    fixedAmountFields: {
        amountVisible: boolean;
        capVisible: boolean;
    };
    expectedVisibility?: boolean;
}
const inputText = {
    voucherProvider: 'LMS TESTSING', // Carro Care Apps
    category: 'Repair', // All | Grooming | Repair | Servicing | Spray
    discount_amount_percentage: '10', // // FixedAmt | Percentage
    limitAvailableQty: "3",
    discountType: "Percentage",
    discountName: "LMS PW DISCOUNT 1",
    expireMonth: "01",
    // expireDay: "01",
    // expireOn: "",
    expiryDate: ""
}
inputText.expiryDate = util.getNextDay
console.log("expireDay : " + inputText.expiryDate)

const textVoucherTitle = " ";
export const discountCriteria: DiscountFormData[] = [
    {
        discount_type: inputText.discountType, // FixedAmt | Percentage
        test_description: 'WithMinimumPurchase',
        voucher_provider_name: inputText.voucherProvider,
        // discount_name: inputText.discountName + " Expiry on " + inputText.expireOn + inputText.limitAvailableQty,
        discount_name: inputText.discountName + inputText.category + " Discount",
        voucher_title: textVoucherTitle + inputText.category,
        description: 'desc',
        terms_and_conditions: 'term & condistions',
        country: 'SG',
        currencySign: 'S$',
        discount_amount: '52.75',
        maxiDiscountUses: {
            isLimitAvailableQty: false,
        },
        VoucherExpiration: {
            expiryType: "No", // fromIssueDate
            discountExpiryOn: util.getNextDay,
        },
        percentageFields: {
            amountVisible: true,
            capVisible: true
        },
        minimumPurchase: true,
        minimum_purchase_amount: "1000",
        fixedAmountFields: {
            amountVisible: true,
            capVisible: false
        },
    },
    {
        discount_type: inputText.discountType, // FixedAmt | Percentage
        test_description: 'NoMinimumPurchase',
        voucher_provider_name: inputText.voucherProvider,
        discount_name: inputText.discountName,
        voucher_title: textVoucherTitle + inputText.category,
        description: 'desc',
        terms_and_conditions: 'term & condistions',
        country: 'SG',
        currencySign: 'S$',
        discount_amount: '52.75',

        maxiDiscountUses: {
            isLimitAvailableQty: false,
        },
        VoucherExpiration: {
            expiryType: "No", // fromIssueDate
            discountExpiryOn: util.getNextDay,
        },
        percentageFields: {
            amountVisible: true,
            capVisible: true
        },
        minimumPurchase: false,
        minimum_purchase_amount: "1000",
        fixedAmountFields: {
            amountVisible: true,
            capVisible: false
        },
    }
];

export function getDiscountDescription(description: string) {
    const formData = discountCriteria.find(
        (item) => item.test_description === description
    );
    if (!formData) {
        throw new Error(`No matching scenarios found for: "${description}"`);
    }
    return formData;
}