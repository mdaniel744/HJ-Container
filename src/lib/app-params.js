const isBrowser = typeof window !== "undefined";

const HJ_CONTAINER_BASE44_APP_ID = "6a6b64082a3e26226bfba099";
const BASE44_API_URL = "https://base44.app";

const defaults = {
	appId: process.env.NEXT_PUBLIC_BASE44_APP_ID || HJ_CONTAINER_BASE44_APP_ID,
	apiUrl: process.env.NEXT_PUBLIC_BASE44_API_URL || BASE44_API_URL,
	functionsVersion: process.env.NEXT_PUBLIC_BASE44_FUNCTIONS_VERSION || "",
	appBaseUrl: process.env.NEXT_PUBLIC_BASE44_APP_BASE_URL || "",
};

const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
	if (!isBrowser) {
		return defaultValue;
	}
	const storage = window.localStorage;
	const storageKey = `base44_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	if (removeFromUrl) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
			}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (searchParam) {
		storage.setItem(storageKey, searchParam);
		return searchParam;
	}
	if (defaultValue) {
		storage.setItem(storageKey, defaultValue);
		return defaultValue;
	}
	const storedValue = storage.getItem(storageKey);
	if (storedValue) {
		return storedValue;
	}
	return null;
}

const getAppParams = () => {
	if (!isBrowser) {
		return {
			appId: defaults.appId || null,
			token: null,
			fromUrl: "",
			functionsVersion: defaults.functionsVersion || null,
			appBaseUrl: defaults.appBaseUrl || null,
			apiUrl: defaults.apiUrl,
		};
	}

	const storage = window.localStorage;
	if (getAppParamValue("clear_access_token") === 'true') {
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
	}
	return {
		appId: getAppParamValue("app_id", { defaultValue: defaults.appId }),
		token: getAppParamValue("access_token", { removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: window.location.href }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: defaults.functionsVersion }),
		appBaseUrl: getAppParamValue("app_base_url", { defaultValue: defaults.appBaseUrl }),
		apiUrl: getAppParamValue("api_url", { defaultValue: defaults.apiUrl }),
	}
}


export const appParams = {
	...getAppParams()
}
