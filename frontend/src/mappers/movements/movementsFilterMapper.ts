import { START_CURRENT_YEAR, END_CURRENT_YEAR } from "../../common/constants";
import type { MovementFilter } from "../../domain/movements/types";

const filterFields = {
    startDate: "fromDate",
    endDate: "toDate",
    categoryID: "category",
    categoryType: "categoryType",
    description: "description",
};

export const getMovementsFilter = (filterValues: MovementFilter) => {
    let fieldsAggregated = 0;
    let formattedFilter = "";

    if (
        filterValues.startDate === undefined &&
        filterValues.endDate === undefined
    ) {
        filterValues.startDate = START_CURRENT_YEAR.toISOString().split("T")[0];
        filterValues.endDate = END_CURRENT_YEAR.toISOString().split("T")[0];
    }
    for (const property in filterValues) {
        const value = filterValues[property as keyof MovementFilter];
        if (value !== undefined) {
            formattedFilter += `${fieldsAggregated > 0 ? "&" : ""}${filterFields[property as keyof MovementFilter]}=${value}`;
            fieldsAggregated++;
        }
    }
    return formattedFilter;
};
