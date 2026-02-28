import { SchemeData, cropMapping, requirementCategoryMapping } from "@/data/schemesData";
import { FarmerProfile } from "@/types";
import { Language } from "@/contexts/LanguageContext";

export interface MatchedScheme {
    scheme_id: number;
    name: string;
    fullName: string;
    benefit: string;
    confidence: number;
    category: string;
    description: string;
    eligibility: string[];
    howToApply: string;
    applicationLink: string;
    matchReasons: string[];
}

/**
 * Resolve translated fields for a scheme.
 * Uses the embedded i18n object from Firestore, falling back to raw fields.
 */
export function resolveI18n(scheme: SchemeData, lang: Language) {
    const i18n = scheme.i18n;
    if (i18n && i18n[lang]) {
        return i18n[lang]!;
    }
    // Fallback to English translation
    if (i18n && i18n.en) {
        return i18n.en;
    }
    // Final fallback: build from raw scheme fields
    return {
        name: scheme.scheme_name,
        benefit: scheme.benefit,
        eligibility: scheme.eligibility,
        documents: scheme.required_documents,
        howToApply: `Apply at: ${scheme.application_link}`,
    };
}

/**
 * Rule-based scheme matching engine.
 * Compares farmer profile against scheme criteria and computes a confidence score.
 */
export function matchSchemes(
    profile: FarmerProfile,
    allSchemes: SchemeData[],
    lang: Language = "en"
): MatchedScheme[] {
    const results: MatchedScheme[] = [];

    for (const scheme of allSchemes) {
        const { score, reasons } = computeMatch(profile, scheme);

        if (score > 0) {
            const i18n = resolveI18n(scheme, lang);
            results.push({
                scheme_id: scheme.scheme_id,
                name: i18n.name,
                fullName: i18n.name,
                benefit: i18n.benefit,
                confidence: Math.min(score, 100),
                category: scheme.category,
                description: i18n.eligibility,
                eligibility: i18n.documents,
                howToApply: i18n.howToApply,
                applicationLink: scheme.application_link,
                matchReasons: reasons,
            });
        }
    }

    // Sort by confidence descending
    results.sort((a, b) => b.confidence - a.confidence);

    // If no personalized results, return universal schemes
    if (results.length === 0) {
        return allSchemes
            .filter((s) => s.farmer_type.includes("All") && !s.land_ownership_required)
            .map((scheme) => {
                const i18n = resolveI18n(scheme, lang);
                return {
                    scheme_id: scheme.scheme_id,
                    name: i18n.name,
                    fullName: i18n.name,
                    benefit: i18n.benefit,
                    confidence: 50,
                    category: scheme.category,
                    description: i18n.eligibility,
                    eligibility: i18n.documents,
                    howToApply: i18n.howToApply,
                    applicationLink: scheme.application_link,
                    matchReasons: ["Universal scheme available to all farmers"],
                };
            });
    }

    return results;
}

function computeMatch(
    profile: FarmerProfile,
    scheme: SchemeData
): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
    let disqualified = false;

    // 1. Farmer type check (critical)
    const profileFarmerType = profile.farmerType.charAt(0).toUpperCase() + profile.farmerType.slice(1);
    if (scheme.farmer_type.includes("All")) {
        score += 20;
        reasons.push("Open to all farmer types");
    } else if (scheme.farmer_type.includes(profileFarmerType)) {
        score += 30;
        reasons.push(`Matches your farmer type: ${profileFarmerType}`);
    } else {
        disqualified = true;
    }

    // 2. Land ownership check (can be disqualifying)
    if (scheme.land_ownership_required) {
        if (profile.landOwnership === "owned" || profile.landOwnership === "both") {
            score += 25;
            reasons.push("You own land (required)");
        } else {
            disqualified = true;
        }
    } else {
        score += 15;
        reasons.push("No land ownership required");
    }

    // 3. Crop type matching
    if (scheme.crop_type.includes("All")) {
        score += 15;
        reasons.push("Applicable to all crop types");
    } else {
        const farmerCropCategories = new Set<string>();
        for (const cropId of profile.crops) {
            const mapped = cropMapping[cropId];
            if (mapped) {
                mapped.forEach((c) => farmerCropCategories.add(c));
            }
        }

        const cropMatch = scheme.crop_type.some((ct) => farmerCropCategories.has(ct));
        if (cropMatch) {
            score += 25;
            reasons.push(`Your crops match: ${scheme.crop_type.join(", ")}`);
        } else {
            score -= 10; // Doesn't fully disqualify, but reduces score
        }
    }

    // 4. Requirement/category interest matching
    const relevantCategories = new Set<string>();
    for (const req of profile.requirements) {
        const categories = requirementCategoryMapping[req];
        if (categories) {
            categories.forEach((c) => relevantCategories.add(c));
        }
    }

    if (relevantCategories.has(scheme.category)) {
        score += 30;
        reasons.push(`Matches your need: ${scheme.category}`);
    } else {
        score += 5; // Small base score for available scheme
    }

    if (disqualified) {
        return { score: 0, reasons: [] };
    }

    return { score: Math.max(score, 0), reasons };
}
