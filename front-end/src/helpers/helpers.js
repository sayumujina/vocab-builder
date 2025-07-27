import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Base URL without the test ID
const baseURL = 'http://localhost:3000/words/';

// For testing error handling
// const errorSimulation = false; // Set to true to test error handling

// Wrap the API calls with async to prevent undefined values
const handleError = fn => async (...params) => {
    try {
        // if (errorSimulation) {
        //     // Simulate an error for testing toast
        //     throw { 
        //         response: { 
        //             status: 404, 
        //             statusText: 'Test Error Message' 
        //         } 
        
        // }
        return await fn(...params);
    } catch (err) {
        toast.error(`${err.response?.status || ''}: ${err.response?.statusText || `Something went wrong`}`);
        return undefined;
    }
};

export const api = {
    getWord: handleError(async wordId => { // Ensure wordId is passed correctly
        const response = await axios.get(baseURL + wordId); // Note: Ensure the wordId is appended correctly, e.g., '/words/123'
        return response.data; // Adjusted to match the expected API endpoint format
    }),
    getAllWords: handleError(async () => {
        const response = await axios.get(baseURL);
        return response.data;
    }),
    deleteWord: handleError(async wordId => {
        const response = await axios.delete(baseURL + wordId);
        return response.data;
    }),
    createWord: handleError(async payload => {
        const response = await axios.post(baseURL, payload);
        return response.data;
    }),
    updateWord: handleError(async payload => {
        const payloadId = payload._id || payload.id;
        const response = await axios.put(baseURL + payloadId, payload);
        return response.data;
    })
};