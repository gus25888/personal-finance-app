const apiBaseUrlValue = import.meta.env.VITE_API_URL;

if (apiBaseUrlValue.length === 0) {
    throw new Error("apiBaseUrl not defined!");
}

export const apiBaseUrl = apiBaseUrlValue;
