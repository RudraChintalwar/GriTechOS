/**
 * Scheme type definition and matching-engine lookup tables.
 * 
 * The actual scheme data now lives in Firestore (collection: "schemes").
 * This file only exports the TypeScript interface and the mapping
 * dictionaries that the rule-based matching engine needs.
 */

export interface SchemeData {
    scheme_id: number;
    scheme_name: string;
    state: string;
    category: string;
    farmer_type: string[];
    land_ownership_required: boolean;
    crop_type: string[];
    benefit: string;
    eligibility: string;
    required_documents: string[];
    application_link: string;
    /** Embedded translations added when seeded / edited via admin panel */
    i18n?: {
        en?: SchemeI18nFields;
        hi?: SchemeI18nFields;
        mr?: SchemeI18nFields;
    };
}

export interface SchemeI18nFields {
    name: string;
    benefit: string;
    eligibility: string;
    documents: string[];
    howToApply: string;
}

// Mapping from profile crop IDs to scheme crop_type values
export const cropMapping: Record<string, string[]> = {
    wheat: ["All", "Food Crops"],
    rice: ["All", "Food Crops"],
    cotton: ["All", "Commercial Crops"],
    sugarcane: ["All", "Commercial Crops"],
    vegetables: ["All", "Food Crops"],
    fruits: ["All", "Fruits"],
    pulses: ["All", "Food Crops"],
    oilseeds: ["All", "Oilseeds"],
};

// Mapping from profile requirements to scheme categories
export const requirementCategoryMapping: Record<string, string[]> = {
    credit: ["Income Support", "Development"],
    insurance: ["Insurance"],
    irrigation: ["Irrigation", "Solar"],
    subsidy: ["Machinery", "Horticulture", "Livestock", "Solar", "Development"],
};
