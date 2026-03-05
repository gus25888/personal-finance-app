export const formatDateToDDMMYYYY = (date: Date): string => {
    // TODO: Implementar como parte de la mejora visual de los datos de la tabla de Movements: las fechas deben verse en formato dd-mm-yyyy y los números de montos deberían verse con separadores de miles.
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export const formatDateForFilters = (date: Date): string =>
    // returns YYYY-MM-DD
    date.toLocaleDateString("en-CA");
