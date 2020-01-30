import { createContext } from 'react';

// check if dev or production
const isProduction = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return false;
    }
    return true;
}


export const ApiRequestsContext = createContext(
    {
        API: isProduction() ? 
            'http://api-sichem.nedisa.com'
            : 'http://localhost:8000'
    }
);