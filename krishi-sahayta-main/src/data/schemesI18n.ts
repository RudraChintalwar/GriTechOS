/**
 * Multilingual translations for scheme data.
 * Keyed by scheme_id → language → translated fields.
 */
export interface SchemeTranslation {
    name: string;
    benefit: string;
    eligibility: string;
    documents: string[];
    howToApply: string;
}

type Lang = "en" | "hi" | "mr";

export const schemeTranslations: Record<number, Record<Lang, SchemeTranslation>> = {
    1: {
        en: {
            name: "PM-KISAN Samman Nidhi",
            benefit: "₹6,000 per year direct income support (₹2,000 every 4 months)",
            eligibility: "Farmer families owning cultivable land up to 2 hectares",
            documents: ["Aadhaar Card", "Land Records (7/12 Extract)", "Bank Passbook"],
            howToApply: "Register online at pmkisan.gov.in or visit nearest CSC centre",
        },
        hi: {
            name: "पीएम-किसान सम्मान निधि",
            benefit: "₹6,000 प्रति वर्ष प्रत्यक्ष आय सहायता (हर 4 महीने ₹2,000)",
            eligibility: "2 हेक्टेयर तक खेती योग्य भूमि वाले किसान परिवार",
            documents: ["आधार कार्ड", "भूमि रिकॉर्ड (7/12 उतारा)", "बैंक पासबुक"],
            howToApply: "pmkisan.gov.in पर ऑनलाइन रजिस्टर करें या नजदीकी CSC केंद्र जाएं",
        },
        mr: {
            name: "पीएम-किसान सन्मान निधी",
            benefit: "₹6,000 प्रतिवर्षी थेट उत्पन्न सहाय्य (दर 4 महिन्यांनी ₹2,000)",
            eligibility: "2 हेक्टरपर्यंत शेतजमीन असलेले शेतकरी कुटुंब",
            documents: ["आधार कार्ड", "जमीन नोंदी (7/12 उतारा)", "बँक पासबुक"],
            howToApply: "pmkisan.gov.in वर ऑनलाइन नोंदणी करा किंवा जवळच्या CSC केंद्रात जा",
        },
    },
    2: {
        en: {
            name: "Namo Shetkari Mahasanman Nidhi Yojana",
            benefit: "Additional ₹6,000 per year state support (total ₹12,000 with PM-KISAN)",
            eligibility: "Must be a registered PM-KISAN beneficiary in Maharashtra",
            documents: ["Aadhaar Card", "Land Record (7/12)", "Bank Details"],
            howToApply: "Auto-enrolled if PM-KISAN beneficiary; check status on MahaDBT",
        },
        hi: {
            name: "नमो शेतकरी महासन्मान निधि योजना",
            benefit: "अतिरिक्त ₹6,000 प्रति वर्ष राज्य सहायता (PM-KISAN के साथ कुल ₹12,000)",
            eligibility: "महाराष्ट्र में पंजीकृत PM-KISAN लाभार्थी होना चाहिए",
            documents: ["आधार कार्ड", "भूमि रिकॉर्ड (7/12)", "बैंक विवरण"],
            howToApply: "PM-KISAN लाभार्थी होने पर स्वतः नामांकन; MahaDBT पर स्थिति जांचें",
        },
        mr: {
            name: "नमो शेतकरी महासन्मान निधी योजना",
            benefit: "अतिरिक्त ₹6,000 प्रतिवर्षी राज्य सहाय्य (PM-KISAN सोबत एकूण ₹12,000)",
            eligibility: "महाराष्ट्रातील नोंदणीकृत PM-KISAN लाभार्थी असणे आवश्यक",
            documents: ["आधार कार्ड", "जमीन नोंद (7/12)", "बँक तपशील"],
            howToApply: "PM-KISAN लाभार्थी असल्यास स्वयंचलित नोंदणी; MahaDBT वर स्थिती तपासा",
        },
    },
    3: {
        en: {
            name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            benefit: "Crop insurance: premium only 2% for Kharif, 1.5% for Rabi; full claim on loss",
            eligibility: "Farmers cultivating notified crops in notified areas",
            documents: ["Aadhaar Card", "Bank Passbook", "Land/Lease Proof", "Sowing Certificate"],
            howToApply: "Apply through your bank, CSC centre, or PMFBY app before sowing deadline",
        },
        hi: {
            name: "प्रधान मंत्री फसल बीमा योजना (PMFBY)",
            benefit: "फसल बीमा: प्रीमियम खरीफ 2%, रबी 1.5%; नुकसान पर पूरा दावा",
            eligibility: "अधिसूचित क्षेत्र में अधिसूचित फसलें उगाने वाले किसान",
            documents: ["आधार कार्ड", "बैंक पासबुक", "भूमि/पट्टा प्रमाण", "बुवाई प्रमाणपत्र"],
            howToApply: "बुवाई की अंतिम तिथि से पहले बैंक, CSC केंद्र, या PMFBY ऐप से आवेदन करें",
        },
        mr: {
            name: "प्रधान मंत्री पीक विमा योजना (PMFBY)",
            benefit: "पीक विमा: प्रीमियम खरीप 2%, रब्बी 1.5%; नुकसानीवर पूर्ण दावा",
            eligibility: "अधिसूचित क्षेत्रातील अधिसूचित पिके घेणारे शेतकरी",
            documents: ["आधार कार्ड", "बँक पासबुक", "जमीन/भाडेपट्टा पुरावा", "पेरणी प्रमाणपत्र"],
            howToApply: "पेरणी मुदतीपूर्वी बँक, CSC केंद्र, किंवा PMFBY अॅपद्वारे अर्ज करा",
        },
    },
    4: {
        en: {
            name: "PM Krishi Sinchayee Yojana (PMKSY)",
            benefit: "55-75% subsidy on drip/sprinkler irrigation systems",
            eligibility: "Farmers owning agricultural land in notified areas",
            documents: ["Land Record (7/12)", "Aadhaar Card", "Bank Details"],
            howToApply: "Apply through MahaDBT portal under Agriculture Department schemes",
        },
        hi: {
            name: "पीएम कृषि सिंचाई योजना (PMKSY)",
            benefit: "ड्रिप/स्प्रिंकलर सिंचाई प्रणालियों पर 55-75% सब्सिडी",
            eligibility: "अधिसूचित क्षेत्र में कृषि भूमि के मालिक किसान",
            documents: ["भूमि रिकॉर्ड (7/12)", "आधार कार्ड", "बैंक विवरण"],
            howToApply: "MahaDBT पोर्टल पर कृषि विभाग योजनाओं में आवेदन करें",
        },
        mr: {
            name: "पीएम कृषी सिंचन योजना (PMKSY)",
            benefit: "ठिबक/तुषार सिंचन प्रणालींवर 55-75% अनुदान",
            eligibility: "अधिसूचित क्षेत्रातील शेतजमीन मालक शेतकरी",
            documents: ["जमीन नोंद (7/12)", "आधार कार्ड", "बँक तपशील"],
            howToApply: "MahaDBT पोर्टलवर कृषी विभाग योजनांमध्ये अर्ज करा",
        },
    },
    5: {
        en: {
            name: "Magel Tyala Shettale Yojana",
            benefit: "Up to ₹50,000 subsidy for farm pond construction",
            eligibility: "Small/marginal farmers in water-scarce areas of Maharashtra",
            documents: ["Land Documents (7/12)", "Aadhaar Card", "Gram Panchayat NOC"],
            howToApply: "Apply through MahaDBT portal or District Agriculture Office",
        },
        hi: {
            name: "मागेल त्याला शेततळे योजना",
            benefit: "खेत तालाब निर्माण के लिए ₹50,000 तक सब्सिडी",
            eligibility: "महाराष्ट्र के जल-दुर्लभ क्षेत्रों के छोटे/सीमांत किसान",
            documents: ["भूमि दस्तावेज (7/12)", "आधार कार्ड", "ग्राम पंचायत एनओसी"],
            howToApply: "MahaDBT पोर्टल या जिला कृषि कार्यालय से आवेदन करें",
        },
        mr: {
            name: "मागेल त्याला शेततळे योजना",
            benefit: "शेततळे बांधकामासाठी ₹50,000 पर्यंत अनुदान",
            eligibility: "महाराष्ट्रातील पाणीटंचाई भागातील अल्प/अत्यल्प भूधारक शेतकरी",
            documents: ["जमीन कागदपत्रे (7/12)", "आधार कार्ड", "ग्रामपंचायत ना-हरकत"],
            howToApply: "MahaDBT पोर्टल किंवा जिल्हा कृषी कार्यालयाद्वारे अर्ज करा",
        },
    },
    6: {
        en: {
            name: "PM-KUSUM Solar Pump Scheme",
            benefit: "Up to 90% subsidy on solar irrigation pumps (60% Govt + 30% loan)",
            eligibility: "Farmers using electricity or diesel pumps for irrigation",
            documents: ["Land Record", "Electricity Connection Proof", "Aadhaar Card"],
            howToApply: "Apply on PM-KUSUM portal or through MSEDCL office",
        },
        hi: {
            name: "पीएम-कुसुम सोलर पंप योजना",
            benefit: "सोलर सिंचाई पंप पर 90% तक सब्सिडी (60% सरकार + 30% ऋण)",
            eligibility: "सिंचाई के लिए बिजली या डीजल पंप का उपयोग करने वाले किसान",
            documents: ["भूमि रिकॉर्ड", "बिजली कनेक्शन प्रमाण", "आधार कार्ड"],
            howToApply: "PM-KUSUM पोर्टल पर या MSEDCL कार्यालय से आवेदन करें",
        },
        mr: {
            name: "पीएम-कुसुम सोलर पंप योजना",
            benefit: "सौर सिंचन पंपावर 90% पर्यंत अनुदान (60% सरकार + 30% कर्ज)",
            eligibility: "सिंचनासाठी वीज किंवा डिझेल पंप वापरणारे शेतकरी",
            documents: ["जमीन नोंद", "वीज जोडणी पुरावा", "आधार कार्ड"],
            howToApply: "PM-KUSUM पोर्टलवर किंवा MSEDCL कार्यालयाद्वारे अर्ज करा",
        },
    },
    7: {
        en: {
            name: "Magel Tyala Saur Krushi Pump",
            benefit: "95% subsidy on 3HP/5HP solar pump sets for irrigation",
            eligibility: "Small/marginal farmers in Maharashtra without electricity connection",
            documents: ["Aadhaar Card", "Land Record (7/12)", "No-electricity proof"],
            howToApply: "Apply through MSEDCL or Mukhya Mantri Solar Pump portal",
        },
        hi: {
            name: "मागेल त्याला सौर कृषी पंप",
            benefit: "3HP/5HP सोलर पंप सेट पर 95% सब्सिडी",
            eligibility: "बिजली कनेक्शन के बिना महाराष्ट्र के छोटे/सीमांत किसान",
            documents: ["आधार कार्ड", "भूमि रिकॉर्ड (7/12)", "बिजली न होने का प्रमाण"],
            howToApply: "MSEDCL या मुख्यमंत्री सोलर पंप पोर्टल से आवेदन करें",
        },
        mr: {
            name: "मागेल त्याला सौर कृषी पंप",
            benefit: "3HP/5HP सौर पंप संचावर 95% अनुदान",
            eligibility: "वीज जोडणी नसलेले महाराष्ट्रातील अल्प/अत्यल्प भूधारक शेतकरी",
            documents: ["आधार कार्ड", "जमीन नोंद (7/12)", "वीज नसल्याचा पुरावा"],
            howToApply: "MSEDCL किंवा मुख्यमंत्री सौर पंप पोर्टलद्वारे अर्ज करा",
        },
    },
    8: {
        en: {
            name: "Sub-Mission on Agricultural Mechanization (SMAM)",
            benefit: "50-80% subsidy on farm equipment (tractors, tillers, harvesters)",
            eligibility: "Registered farmers; priority to SC/ST and women farmers",
            documents: ["Aadhaar Card", "Bank Details", "Land Record"],
            howToApply: "Apply on agrimachinery.nic.in portal with Aadhaar authentication",
        },
        hi: {
            name: "कृषि यंत्रीकरण उप-मिशन (SMAM)",
            benefit: "कृषि उपकरणों पर 50-80% सब्सिडी (ट्रैक्टर, टिलर, हार्वेस्टर)",
            eligibility: "पंजीकृत किसान; SC/ST और महिला किसानों को प्राथमिकता",
            documents: ["आधार कार्ड", "बैंक विवरण", "भूमि रिकॉर्ड"],
            howToApply: "agrimachinery.nic.in पोर्टल पर आधार प्रमाणीकरण से आवेदन करें",
        },
        mr: {
            name: "कृषी यांत्रिकीकरण उप-मिशन (SMAM)",
            benefit: "कृषी उपकरणांवर 50-80% अनुदान (ट्रॅक्टर, टिलर, हार्वेस्टर)",
            eligibility: "नोंदणीकृत शेतकरी; SC/ST आणि महिला शेतकऱ्यांना प्राधान्य",
            documents: ["आधार कार्ड", "बँक तपशील", "जमीन नोंद"],
            howToApply: "agrimachinery.nic.in पोर्टलवर आधार प्रमाणीकरणाने अर्ज करा",
        },
    },
    9: {
        en: {
            name: "Bhausaheb Fundkar Phalbag Lagvad Yojana",
            benefit: "₹40,000-1,00,000 per hectare subsidy for fruit plantation",
            eligibility: "Farmers cultivating horticulture crops with minimum 0.20 hectare land",
            documents: ["Land Record (7/12)", "Aadhaar Card", "Bank Passbook"],
            howToApply: "Apply through MahaDBT portal under Horticulture Department",
        },
        hi: {
            name: "भाऊसाहेब फुंडकर फलबाग लागवड योजना",
            benefit: "फल बागान के लिए ₹40,000-1,00,000 प्रति हेक्टेयर सब्सिडी",
            eligibility: "न्यूनतम 0.20 हेक्टेयर भूमि पर बागवानी फसलें उगाने वाले किसान",
            documents: ["भूमि रिकॉर्ड (7/12)", "आधार कार्ड", "बैंक पासबुक"],
            howToApply: "MahaDBT पोर्टल पर बागवानी विभाग में आवेदन करें",
        },
        mr: {
            name: "भाऊसाहेब फुंडकर फळबाग लागवड योजना",
            benefit: "फळबागासाठी ₹40,000-1,00,000 प्रति हेक्टर अनुदान",
            eligibility: "किमान 0.20 हेक्टर जमिनीवर फलोत्पादन पिके घेणारे शेतकरी",
            documents: ["जमीन नोंद (7/12)", "आधार कार्ड", "बँक पासबुक"],
            howToApply: "MahaDBT पोर्टलवर फलोत्पादन विभागांतर्गत अर्ज करा",
        },
    },
    10: {
        en: {
            name: "Rashtriya Krishi Vikas Yojana (RKVY)",
            benefit: "Financial assistance for agriculture development projects and infrastructure",
            eligibility: "Agriculture-based activities; individual or group applications accepted",
            documents: ["Project Proposal", "Identity Proof", "Bank Details"],
            howToApply: "Apply through District Agriculture Office or RKVY portal",
        },
        hi: {
            name: "राष्ट्रीय कृषि विकास योजना (RKVY)",
            benefit: "कृषि विकास परियोजनाओं और बुनियादी ढांचे के लिए वित्तीय सहायता",
            eligibility: "कृषि-आधारित गतिविधियां; व्यक्तिगत या समूह आवेदन स्वीकार्य",
            documents: ["परियोजना प्रस्ताव", "पहचान प्रमाण", "बैंक विवरण"],
            howToApply: "जिला कृषि कार्यालय या RKVY पोर्टल से आवेदन करें",
        },
        mr: {
            name: "राष्ट्रीय कृषी विकास योजना (RKVY)",
            benefit: "कृषी विकास प्रकल्प आणि पायाभूत सुविधांसाठी आर्थिक सहाय्य",
            eligibility: "कृषी-आधारित उपक्रम; वैयक्तिक किंवा सामूहिक अर्ज स्वीकार्य",
            documents: ["प्रकल्प प्रस्ताव", "ओळख पुरावा", "बँक तपशील"],
            howToApply: "जिल्हा कृषी कार्यालय किंवा RKVY पोर्टलद्वारे अर्ज करा",
        },
    },
    11: {
        en: {
            name: "Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana",
            benefit: "Up to ₹2.5 lakh subsidy for wells, pump sets, micro-irrigation, and pipelines",
            eligibility: "SC/Neo-Buddhist farmers holding 0.40 to 6 hectares",
            documents: ["Caste Certificate", "7/12 Extract", "Aadhaar Card", "Bank Passbook"],
            howToApply: "Apply through MahaDBT portal under Agriculture Department",
        },
        hi: {
            name: "डॉ. बाबासाहेब अंबेडकर कृषि स्वावलंबन योजना",
            benefit: "कुएं, पंप सेट, सूक्ष्म सिंचाई और पाइपलाइन के लिए ₹2.5 लाख तक सब्सिडी",
            eligibility: "0.40 से 6 हेक्टेयर भूमि वाले SC/नव-बौद्ध किसान",
            documents: ["जाति प्रमाणपत्र", "7/12 उतारा", "आधार कार्ड", "बैंक पासबुक"],
            howToApply: "MahaDBT पोर्टल पर कृषि विभाग में आवेदन करें",
        },
        mr: {
            name: "डॉ. बाबासाहेब आंबेडकर कृषी स्वावलंबन योजना",
            benefit: "विहीर, पंप संच, सूक्ष्म सिंचन आणि पाइपलाइनसाठी ₹2.5 लाख पर्यंत अनुदान",
            eligibility: "0.40 ते 6 हेक्टर जमीन असलेले SC/नवबौद्ध शेतकरी",
            documents: ["जात प्रमाणपत्र", "7/12 उतारा", "आधार कार्ड", "बँक पासबुक"],
            howToApply: "MahaDBT पोर्टलवर कृषी विभागांतर्गत अर्ज करा",
        },
    },
    12: {
        en: {
            name: "Nanaji Deshmukh Krishi Sanjeevani Yojana (PoCRA)",
            benefit: "Up to ₹3 lakh for shade nets, polyhouses, drip irrigation, and climate-resilient farming",
            eligibility: "Farmers in selected drought-prone villages of Maharashtra",
            documents: ["Aadhaar Card", "7/12 Extract", "Bank Passbook"],
            howToApply: "Apply through PoCRA/MahaDBT portal (dbt.mahapocra.gov.in)",
        },
        hi: {
            name: "नानाजी देशमुख कृषि संजीवनी योजना (PoCRA)",
            benefit: "शेडनेट, पॉलीहाउस, ड्रिप सिंचाई और जलवायु-अनुकूल खेती के लिए ₹3 लाख तक",
            eligibility: "महाराष्ट्र के चयनित सूखाग्रस्त गांवों के किसान",
            documents: ["आधार कार्ड", "7/12 उतारा", "बैंक पासबुक"],
            howToApply: "PoCRA/MahaDBT पोर्टल (dbt.mahapocra.gov.in) से आवेदन करें",
        },
        mr: {
            name: "नानाजी देशमुख कृषी संजीवनी योजना (PoCRA)",
            benefit: "शेडनेट, पॉलीहाउस, ठिबक सिंचन आणि हवामान-अनुकूल शेतीसाठी ₹3 लाख पर्यंत",
            eligibility: "महाराष्ट्रातील निवडक दुष्काळग्रस्त गावांतील शेतकरी",
            documents: ["आधार कार्ड", "7/12 उतारा", "बँक पासबुक"],
            howToApply: "PoCRA/MahaDBT पोर्टल (dbt.mahapocra.gov.in) द्वारे अर्ज करा",
        },
    },
    13: {
        en: {
            name: "Gopinath Munde Shetkari Apghat Suraksha Yojana",
            benefit: "₹2 lakh for accidental death; ₹1 lakh for partial disability",
            eligibility: "All registered farmers (10-75 years) and family members in Maharashtra",
            documents: ["7/12 Extract", "Aadhaar Card", "FIR/Police Report", "Medical/Death Certificate"],
            howToApply: "Apply offline through Taluka Agriculture Officer within 90 days of accident",
        },
        hi: {
            name: "गोपीनाथ मुंडे शेतकरी अपघात सुरक्षा योजना",
            benefit: "दुर्घटना मृत्यु पर ₹2 लाख; आंशिक विकलांगता पर ₹1 लाख",
            eligibility: "महाराष्ट्र के सभी पंजीकृत किसान (10-75 वर्ष) और परिवार सदस्य",
            documents: ["7/12 उतारा", "आधार कार्ड", "FIR/पुलिस रिपोर्ट", "मेडिकल/मृत्यु प्रमाणपत्र"],
            howToApply: "दुर्घटना के 90 दिनों के भीतर तालुका कृषि अधिकारी से ऑफलाइन आवेदन करें",
        },
        mr: {
            name: "गोपीनाथ मुंडे शेतकरी अपघात सुरक्षा योजना",
            benefit: "अपघाती मृत्यूवर ₹2 लाख; अंशतः अपंगत्वावर ₹1 लाख",
            eligibility: "महाराष्ट्रातील सर्व नोंदणीकृत शेतकरी (10-75 वर्ष) आणि कुटुंब सदस्य",
            documents: ["7/12 उतारा", "आधार कार्ड", "FIR/पोलिस अहवाल", "वैद्यकीय/मृत्यू प्रमाणपत्र"],
            howToApply: "अपघातानंतर 90 दिवसांच्या आत तालुका कृषी अधिकाऱ्यांमार्फत ऑफलाइन अर्ज करा",
        },
    },
    14: {
        en: {
            name: "Sharad Pawar Gram Samruddhi Yojana",
            benefit: "₹77,188 for cattle sheds; additional grants for poultry/goat sheds and compost pits",
            eligibility: "Small/marginal farmers holding an active MGNREGA job card",
            documents: ["MGNREGA Job Card", "7/12 Extract", "Gram Panchayat Resolution", "Aadhaar Card"],
            howToApply: "Apply through Gram Panchayat office under MGNREGA scheme",
        },
        hi: {
            name: "शरद पवार ग्राम समृद्धि योजना",
            benefit: "गौशाला के लिए ₹77,188; मुर्गी/बकरी शेड और कम्पोस्ट पिट के लिए अतिरिक्त अनुदान",
            eligibility: "सक्रिय मनरेगा जॉब कार्ड वाले छोटे/सीमांत किसान",
            documents: ["मनरेगा जॉब कार्ड", "7/12 उतारा", "ग्राम पंचायत प्रस्ताव", "आधार कार्ड"],
            howToApply: "मनरेगा योजना के तहत ग्राम पंचायत कार्यालय से आवेदन करें",
        },
        mr: {
            name: "शरद पवार ग्राम समृद्धी योजना",
            benefit: "गोठ्यासाठी ₹77,188; कुक्कुट/शेळीपालन शेड आणि कंपोस्ट खड्ड्यांसाठी अतिरिक्त अनुदान",
            eligibility: "सक्रिय मनरेगा जॉब कार्ड असलेले अल्प/अत्यल्प भूधारक शेतकरी",
            documents: ["मनरेगा जॉब कार्ड", "7/12 उतारा", "ग्रामपंचायत ठराव", "आधार कार्ड"],
            howToApply: "मनरेगा योजनेअंतर्गत ग्रामपंचायत कार्यालयात अर्ज करा",
        },
    },
    15: {
        en: {
            name: "Birsa Munda Krishi Kranti Yojana",
            benefit: "Up to ₹2.5 lakh for new wells, old well repairs, pump sets, and farm ponds",
            eligibility: "Scheduled Tribe (ST) farmers holding 0.40 to 6 hectares",
            documents: ["Caste Certificate", "7/12 Extract", "Aadhaar Card", "Bank Passbook"],
            howToApply: "Apply through MahaDBT portal under Tribal Development Department",
        },
        hi: {
            name: "बिरसा मुंडा कृषि क्रांति योजना",
            benefit: "नए कुएं, पुराने कुओं की मरम्मत, पंप सेट और खेत तालाब के लिए ₹2.5 लाख तक",
            eligibility: "0.40 से 6 हेक्टेयर भूमि वाले अनुसूचित जनजाति (ST) किसान",
            documents: ["जाति प्रमाणपत्र", "7/12 उतारा", "आधार कार्ड", "बैंक पासबुक"],
            howToApply: "MahaDBT पोर्टल पर आदिवासी विकास विभाग में आवेदन करें",
        },
        mr: {
            name: "बिरसा मुंडा कृषी क्रांती योजना",
            benefit: "नवीन विहीर, जुन्या विहिरींची दुरुस्ती, पंप संच आणि शेततळ्यासाठी ₹2.5 लाख पर्यंत",
            eligibility: "0.40 ते 6 हेक्टर जमीन असलेले अनुसूचित जमाती (ST) शेतकरी",
            documents: ["जात प्रमाणपत्र", "7/12 उतारा", "आधार कार्ड", "बँक पासबुक"],
            howToApply: "MahaDBT पोर्टलवर आदिवासी विकास विभागांतर्गत अर्ज करा",
        },
    },
};
