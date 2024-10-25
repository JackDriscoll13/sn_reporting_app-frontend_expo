// This file contains functions that check if data is valid 
import { EngagementResponseType } from '../types/backend_responses';
// CHECKS IF POST DATA IS VALID BEFORE SENDING TO BACKEND
/**
 * Validates if all fields in an object have valid values.
 * @param {Record<string, any>} data - The object to validate
 * @returns {boolean} - True if all fields are valid, false otherwise
 */
export const isFetchDataValid = (data: Record<string, any>): boolean => {
    return Object.values(data).every(value => 
      value && 
      value !== '' && 
      value !== 'Invalid Date' &&
      !(typeof value === 'number' && isNaN(value))
    );
  };


export function validateAndLogResponse(responseData: EngagementResponseType): boolean {
    // 1. Validate responseData structure
    if (!responseData.metadata || !responseData.data || !responseData.message) {
      console.warn('\tResponse is missing expected fields:', responseData);
      throw new Error('Invalid response structure');
    }
  
    // 2. Log the message
    console.log('\tResponse message:', responseData.message);
  
    // 3. Print the names of each object in responseData.data
    console.log('\tData objects:');
    Object.keys(responseData.data).forEach(key => {
      console.log(`\t- ${key}`);
    });
  
    return true; // Indicates successful validation and logging
  }


// CHECKS RESPONSE FOR PROPER FORMAT
export const checkResponseKeys = (response: any): string[] | undefined => {
  console.log('Response is of type:', typeof response);
  if (typeof response !== 'object' || response === null) {
    console.warn('Response is not an object:', response);
    return;
  }

  const keys = Object.keys(response);
  console.log('Response keys:', keys);

  // Check for common expected keys
  const expectedKeys = ['data', 'metadata', 'status', 'message'];
  const missingKeys = expectedKeys.filter(key => !keys.includes(key));
  
  if (missingKeys.length > 0) {
    console.warn('Missing expected keys:', missingKeys);
  }

  // Log all keys and their types
  keys.forEach(key => {
    const value = response[key];
    const type = Array.isArray(value) ? 'array' : typeof value;
    console.log(`Key: ${key}, Type: ${type}`);
    
    // If it's an object or array, log its structure
    if (type === 'object' || type === 'array') {
      console.log(`Structure of ${key}:`, JSON.stringify(value, null, 2));
    }
  });

  return keys;
};


// CHECKS IF DATA IS AN ARRAY
export const isValidDataArray = (data: any): boolean => {
  if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      console.log('Type of data:', typeof data);
      if (typeof data === 'object') {
          console.log('Object keys:', Object.keys(data));
      }
      return false;
  }
  
  if (data.length === 0) {
      console.warn('Data array is empty');
      return false;
  }
  
  console.log('Valid data array with', data.length, 'items');
  return true;
};