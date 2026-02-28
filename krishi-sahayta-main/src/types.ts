/**
 * Shared types used across the GriTech OS application.
 */

export interface FarmerProfile {
    district: string;
    farmerType: string;
    landOwnership: string;
    landSize: number;
    crops: string[];
    requirements: string[];
}

export interface SearchHistoryEntry {
    id?: string;
    criteria: FarmerProfile;
    resultCount: number;
    topSchemes: string[];
    topSchemeIds?: string[];
    timestamp: string;
}
