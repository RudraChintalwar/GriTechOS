import { FarmerProfile } from "@/pages/Dashboard";
import { MatchedScheme } from "@/lib/schemeEngine";
import { Language } from "@/contexts/LanguageContext";

const PYTHON_API = "";

export async function generatePdf(
  profile: FarmerProfile,
  schemes: MatchedScheme[],
  lang: Language
) {
  try {
    const response = await fetch(`/python-api/generate-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, schemes, language: lang }),
    });

    if (!response.ok) throw new Error("PDF API failed");

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/pdf")) {
      // WeasyPrint returned a real PDF — download it
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AgroDBT_Schemes_${lang}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Fallback: HTML returned — open in new window for print-to-PDF
      const html = await response.text();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    }
  } catch (error) {
    console.error("Python PDF API unavailable, using browser fallback:", error);
    // Final fallback — generate HTML locally
    generateLocalHtmlPdf(profile, schemes, lang);
  }
}

// ─── Local HTML fallback (when Python API is down) ──────
function generateLocalHtmlPdf(
  profile: FarmerProfile,
  schemes: MatchedScheme[],
  lang: Language
) {
  const labels: Record<Language, Record<string, string>> = {
    en: { title: "AgroDBT — Matched Government Schemes", profile: "Farmer Profile", district: "District", type: "Farmer Type", crops: "Crops", requirements: "Requirements", schemes: "Matched Schemes", benefit: "Benefit", confidence: "Match", description: "Description", eligibility: "Required Documents", howToApply: "How to Apply", generatedAt: "Generated on", note: "Auto-generated report. Verify with official sources." },
    hi: { title: "AgroDBT — मिलती-जुलती सरकारी योजनाएँ", profile: "किसान प्रोफ़ाइल", district: "जिला", type: "किसान प्रकार", crops: "फसलें", requirements: "आवश्यकताएँ", schemes: "मिलती-जुलती योजनाएँ", benefit: "लाभ", confidence: "मिलान", description: "विवरण", eligibility: "आवश्यक दस्तावेज", howToApply: "आवेदन कैसे करें", generatedAt: "तारीख", note: "स्वचालित रिपोर्ट। कृपया आधिकारिक जानकारी सत्यापित करें।" },
    mr: { title: "AgroDBT — जुळणाऱ्या सरकारी योजना", profile: "शेतकरी प्रोफाइल", district: "जिल्हा", type: "शेतकरी प्रकार", crops: "पिके", requirements: "आवश्यकता", schemes: "जुळणाऱ्या योजना", benefit: "लाभ", confidence: "जुळणी", description: "वर्णन", eligibility: "आवश्यक कागदपत्रे", howToApply: "अर्ज कसा करावा", generatedAt: "तारीख", note: "स्वयंचलित अहवाल. अधिकृत माहिती तपासा." },
  };

  const l = labels[lang];
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${l.title}</title>
  <style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Noto Sans Devanagari','Inter',sans-serif;color:#1a1a1a;padding:40px;line-height:1.6;font-size:13px}
  .hdr{background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;padding:20px 24px;border-radius:8px;margin-bottom:20px}.hdr h1{font-size:20px}
  .profile{background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px}.profile h2{color:#15803d;font-size:14px;margin-bottom:8px}
  .card{border:1px solid #d1d5db;border-radius:8px;padding:14px 16px;margin-bottom:14px;page-break-inside:avoid}.card h3{color:#15803d;font-size:14px}
  .benefit{background:#fef3c7;border-left:3px solid #f59e0b;padding:6px 10px;margin:8px 0;font-weight:600;color:#92400e;border-radius:0 6px 6px 0}
  .lbl{font-weight:600;color:#374151}.footer{margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;color:#999;font-size:10px;text-align:center}
  @media print{body{padding:20px}.card{break-inside:avoid}}</style></head>
  <body>
  <div class="hdr"><h1>🌾 ${l.title}</h1><div style="font-size:11px;opacity:0.85">${l.generatedAt}: ${new Date().toLocaleDateString()}</div></div>
  <div class="profile"><h2>👤 ${l.profile}</h2>
  <div><span class="lbl">${l.district}:</span> ${profile.district || "—"} &nbsp; <span class="lbl">${l.type}:</span> ${profile.farmerType || "—"}</div>
  <div><span class="lbl">${l.crops}:</span> ${profile.crops.join(", ") || "—"} &nbsp; <span class="lbl">${l.requirements}:</span> ${profile.requirements.join(", ") || "—"}</div></div>
  <h2 style="color:#15803d;border-bottom:2px solid #22c55e;padding-bottom:6px;margin-bottom:14px">📋 ${l.schemes} (${schemes.length})</h2>
  ${schemes.map((s, i) => `<div class="card"><h3>${i + 1}. ${s.name}</h3><div style="color:#888;font-size:10px">${s.fullName}</div>
  <div class="benefit">💰 ${l.benefit}: ${s.benefit}</div>
  <div><span class="lbl">${l.description}:</span> ${s.description}</div>
  <div><span class="lbl">${l.eligibility}:</span> ${s.eligibility.join(", ")}</div>
  <div><span class="lbl">${l.howToApply}:</span> ${s.howToApply}</div></div>`).join("")}
  <div class="footer"><p>${l.note}</p><p style="margin-top:4px;font-weight:600">GriTech OS — AgroDBT</p></div>
  <script>window.onload=function(){window.print()}</script></body></html>`;

  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); }
}
