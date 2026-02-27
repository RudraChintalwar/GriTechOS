import { Language } from "./translations";

/**
 * District names translated into Hindi and Marathi.
 * English is used as-is (keys = English names).
 */
const districtTranslations: Record<string, Record<Language, string>> = {
    Ahmednagar: { en: "Ahmednagar", hi: "अहमदनगर", mr: "अहमदनगर" },
    Akola: { en: "Akola", hi: "अकोला", mr: "अकोला" },
    Amravati: { en: "Amravati", hi: "अमरावती", mr: "अमरावती" },
    Aurangabad: { en: "Aurangabad", hi: "औरंगाबाद", mr: "औरंगाबाद" },
    Beed: { en: "Beed", hi: "बीड", mr: "बीड" },
    Bhandara: { en: "Bhandara", hi: "भंडारा", mr: "भंडारा" },
    Buldhana: { en: "Buldhana", hi: "बुलढाणा", mr: "बुलढाणा" },
    Chandrapur: { en: "Chandrapur", hi: "चंद्रपुर", mr: "चंद्रपूर" },
    Dhule: { en: "Dhule", hi: "धुळे", mr: "धुळे" },
    Gadchiroli: { en: "Gadchiroli", hi: "गड़चिरोली", mr: "गडचिरोली" },
    Gondia: { en: "Gondia", hi: "गोंदिया", mr: "गोंदिया" },
    Hingoli: { en: "Hingoli", hi: "हिंगोली", mr: "हिंगोली" },
    Jalgaon: { en: "Jalgaon", hi: "जलगांव", mr: "जळगाव" },
    Jalna: { en: "Jalna", hi: "जालना", mr: "जालना" },
    Kolhapur: { en: "Kolhapur", hi: "कोल्हापुर", mr: "कोल्हापूर" },
    Latur: { en: "Latur", hi: "लातूर", mr: "लातूर" },
    "Mumbai City": { en: "Mumbai City", hi: "मुंबई शहर", mr: "मुंबई शहर" },
    "Mumbai Suburban": { en: "Mumbai Suburban", hi: "मुंबई उपनगर", mr: "मुंबई उपनगर" },
    Nagpur: { en: "Nagpur", hi: "नागपुर", mr: "नागपूर" },
    Nanded: { en: "Nanded", hi: "नांदेड़", mr: "नांदेड" },
    Nandurbar: { en: "Nandurbar", hi: "नंदुरबार", mr: "नंदुरबार" },
    Nashik: { en: "Nashik", hi: "नासिक", mr: "नाशिक" },
    Osmanabad: { en: "Osmanabad", hi: "उस्मानाबाद", mr: "उस्मानाबाद" },
    Palghar: { en: "Palghar", hi: "पालघर", mr: "पालघर" },
    Parbhani: { en: "Parbhani", hi: "परभणी", mr: "परभणी" },
    Pune: { en: "Pune", hi: "पुणे", mr: "पुणे" },
    Raigad: { en: "Raigad", hi: "रायगड़", mr: "रायगड" },
    Ratnagiri: { en: "Ratnagiri", hi: "रत्नागिरी", mr: "रत्नागिरी" },
    Sangli: { en: "Sangli", hi: "सांगली", mr: "सांगली" },
    Satara: { en: "Satara", hi: "सातारा", mr: "सातारा" },
    Sindhudurg: { en: "Sindhudurg", hi: "सिंधुदुर्ग", mr: "सिंधुदुर्ग" },
    Solapur: { en: "Solapur", hi: "सोलापुर", mr: "सोलापूर" },
    Thane: { en: "Thane", hi: "ठाणे", mr: "ठाणे" },
    Wardha: { en: "Wardha", hi: "वर्धा", mr: "वर्धा" },
    Washim: { en: "Washim", hi: "वाशीम", mr: "वाशीम" },
    Yavatmal: { en: "Yavatmal", hi: "यवतमाळ", mr: "यवतमाळ" },
};

/**
 * Translate a district name to the given language.
 * Falls back to the English name if no translation exists.
 */
export const getDistrictName = (
    englishName: string,
    lang: Language
): string => {
    return districtTranslations[englishName]?.[lang] ?? englishName;
};

export default districtTranslations;
