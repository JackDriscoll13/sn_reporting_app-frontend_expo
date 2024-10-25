// This file contains the types for the backend responses

// General response for the Authentication Features:
// Including login, signup, password reset, etc.
// The data field can be further defined for each specific endpoint.
export interface AuthResponse {
    success: boolean;
    message: string;
    data: any;
    metadata: any;
}

// General response for the Coverage Map Features:
// Including the coverage map data, and other related data.
export interface CoverageMapResponse {
    success: boolean;
    message: string;
    data: Record<any, any>; // Not exactly sure what type of json data will be returned.
    metadata: Record<string, number>;
}

export interface EngagementResponseType {
    success: boolean;
    message: string;
    data: any;
    metadata: any;
}

