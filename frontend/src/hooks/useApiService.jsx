import { useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useTheme from './useTheme';
// import useAuth from './useAuth';



const useApiService = () => {
    const base_URL = import.meta.env.VITE_BASE_URL;
    // const { addAlert } = useTheme();
    const createHeaders = (endpoint) => {
        const headers = new Headers();
        // headers.append("Content-Type", endpoint.includes("progress") ? "application/pdf" : "application/json");
        headers.append("Access-Control-Allow-Origin", "*");
        return headers;
    };

    const handleResponse = async (response) => {
        const responseBody = await response.text();
        if (!responseBody) {
            // addAlert('danger', 'Something went wrong');
        }
        return responseBody;
    };

    const handleError = (error) => {
        console.error(error);
        return error;
    };

    const apiRequest = useCallback(async (method, endpoint, data = null) => {
        const requestOptions = {
            method,
            headers: createHeaders(endpoint),
            redirect: "follow",
            ...(data && { body: data }),
        };

        try {
            const response = await fetch(`${base_URL}${endpoint}`, requestOptions);
            return await handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }, []);

    const postAPI = useCallback((endpoint, data = null) => apiRequest('POST', endpoint, data), [apiRequest]);
    const getAPI = useCallback((endpoint) => apiRequest('GET', endpoint), [apiRequest]);
    const putAPI = useCallback((endpoint, data = null) => apiRequest('PUT', endpoint, data), [apiRequest]);
    const patchAPI = useCallback((endpoint, data = null) => apiRequest('PATCH', endpoint, data), [apiRequest]);
    const deleteAPI = useCallback((endpoint, data = null) => apiRequest('DELETE', endpoint, data), [apiRequest]);
    return {
        postAPI,
        getAPI,
        putAPI,
        patchAPI,
        deleteAPI
    };
};

export default useApiService;
