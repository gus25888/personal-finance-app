import { CURRENT_LOCALE } from "../../common/constants";

export const formatDate = (date: Date | string): string => {
    // returns DD-MM-YYYY
    if (typeof date === "string") {
        return new Intl.DateTimeFormat(CURRENT_LOCALE).format(new Date(date));
    } else {
        return new Intl.DateTimeFormat(CURRENT_LOCALE).format(date);
    }
};
export const formatDateForFilters = (date: Date): string =>
    // returns YYYY-MM-DD
    date.toLocaleDateString("en-CA");
