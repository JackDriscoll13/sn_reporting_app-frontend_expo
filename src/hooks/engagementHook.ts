import { useState, useEffect } from 'react';
import { backendUrl } from '../config';
import { isFetchDataValid, validateAndLogResponse } from '../utils/dataCheckers';
import { EngagementResponseType } from '../types/backend_responses';
// Define types for the function parameters
type Endpoint = string;
type RequestBody = Record<string, unknown>;


export const fetchEngagementData = <T>(endpoint: Endpoint, body: RequestBody = {}) => {
    const [data, setData] = useState<T | null>(null);
    const [metadata, setMetadata] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log('Using engagement hook to fetch data for:', endpoint, 'with body:', body);
                const response = await fetch(`${backendUrl}/api/engagement${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });
                const responseData: EngagementResponseType = await response.json();

                if (responseData.success) {
                    validateAndLogResponse(responseData);
                    setData(responseData.data);
                    setMetadata(responseData.metadata);
                } else {
                    console.log('Error fetching data:', responseData.message);
                    setError(responseData.message || 'An error occurred');
                }
            } catch (err) {
                console.error('Error in fetchData:', err);
                setError('An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        if (isFetchDataValid(body)) {
            fetchData();
        }
    }, [endpoint, JSON.stringify(body)]);

    return { data, metadata, isLoading, error };
};