import { CURRENT_CURRENCY, CURRENT_LOCALE } from "../../common/constants";

export const formatCurrency = (value: number): string =>
    new Intl.NumberFormat(CURRENT_LOCALE, {
        style: "currency",
        currency: CURRENT_CURRENCY,
    }).format(value);
