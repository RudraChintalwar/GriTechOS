import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, ChevronDown, ExternalLink,
  HelpCircle, Download, Share2, Star, RefreshCw, X, Globe, Loader2, UserCog
} from "lucide-react";
import { FarmerProfile } from "@/types";
import { MatchedScheme } from "@/lib/schemeEngine";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import FloatingCard from "../FloatingCard";
import { generatePdf } from "@/lib/pdfGenerator";
import { toast } from "sonner";
import { getDistrictName } from "@/i18n/districtTranslations";

const PYTHON_API = "/python-api";

interface ScrapedSection {
  heading: string;
  content: string;
}

interface ScrapedData {
  title: string;
  scheme_name: string;
  source_url: string;
  sections: ScrapedSection[];
  tables: string[][][];
  lists: string[][];
  apply_links: { text: string; url: string }[];
  error?: string;
}

interface SchemesStepProps {
  schemes: MatchedScheme[];
  profile: FarmerProfile;
  onBack: () => void;
  onEditProfile?: () => void;
}

const categoryColors: Record<string, string> = {
  "Income Support": "from-emerald-500 to-green-500",
  "Insurance": "from-purple-500 to-pink-500",
  "Irrigation": "from-cyan-500 to-blue-500",
  "Credit": "from-amber-500 to-orange-500",
  "Price Support": "from-rose-500 to-red-500",
  "Advisory": "from-teal-500 to-emerald-500",
  "Solar": "from-yellow-500 to-orange-500",
  "Machinery": "from-slate-500 to-zinc-500",
  "Horticulture": "from-lime-500 to-green-500",
  "Development": "from-blue-500 to-indigo-500",
  "Livestock": "from-orange-500 to-amber-500",
};

const SchemesStep = ({ schemes, profile, onBack, onEditProfile }: SchemesStepProps) => {
  const [expandedScheme, setExpandedScheme] = useState<number | null>(null);
  const [showExplainer, setShowExplainer] = useState<number | null>(null);
  const [showPdfLangPicker, setShowPdfLangPicker] = useState(false);
  const [detailScheme, setDetailScheme] = useState<MatchedScheme | null>(null);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [isScrapingLoading, setIsScrapingLoading] = useState(false);
  const [scrapeCache, setScrapeCache] = useState<Record<string, ScrapedData>>({});
  const { t, language } = useLanguage();

  const fetchScrapedDetail = useCallback(async (scheme: MatchedScheme) => {
    // Check cache
    if (scrapeCache[scheme.applicationLink]) {
      setScrapedData(scrapeCache[scheme.applicationLink]);
      return;
    }

    if (!scheme.applicationLink.startsWith("http")) {
      setScrapedData(null);
      return;
    }

    setIsScrapingLoading(true);
    try {
      const resp = await fetch(`${PYTHON_API}/scrape-scheme`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scheme.applicationLink, scheme_name: scheme.name }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setScrapedData(data);
        setScrapeCache((prev) => ({ ...prev, [scheme.applicationLink]: data }));
      } else {
        setScrapedData(null);
      }
    } catch {
      setScrapedData(null);
    } finally {
      setIsScrapingLoading(false);
    }
  }, [scrapeCache]);

  const openLearnMore = (scheme: MatchedScheme) => {
    setDetailScheme(scheme);
    setScrapedData(null);
    fetchScrapedDetail(scheme);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-400";
    if (confidence >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  const handleDownloadPdf = (pdfLang: Language) => {
    setShowPdfLangPicker(false);
    generatePdf(profile, schemes, pdfLang);
    toast.success(pdfLang === "en" ? "PDF Downloaded!" : pdfLang === "hi" ? "PDF डाउनलोड हो गई!" : "PDF डाउनलोड झाली!");
  };

  const handleShare = async () => {
    const shareData = {
      title: t("share.title"),
      text: t("share.text", { count: schemes.length }),
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t("share.copied"));
      }
    } catch (err) {
      // User cancelled share
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold font-display mb-2"
            >
              <span className="text-gradient">{schemes.length} {t("schemes.schemesLabel")}</span>
              <span className="text-foreground"> {t("schemes.found")}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              {t("schemes.subtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <motion.button
              onClick={onBack}
              className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">{t("schemes.updateProfile")}</span>
            </motion.button>
            {onEditProfile && (
              <motion.button
                onClick={onEditProfile}
                className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserCog className="w-4 h-4" />
                <span className="hidden sm:inline">{t("profile.updateProfile")}</span>
              </motion.button>
            )}
            <div className="relative">
              <motion.button
                onClick={() => setShowPdfLangPicker(!showPdfLangPicker)}
                className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t("schemes.downloadPdf")}</span>
              </motion.button>

              {/* PDF Language Picker */}
              <AnimatePresence>
                {showPdfLangPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 min-w-[200px] glass-card rounded-xl overflow-hidden shadow-xl z-50 border border-border p-4"
                  >
                    <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {t("pdf.chooseLanguage")}
                    </p>
                    {(["en", "hi", "mr"] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleDownloadPdf(lang)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground transition-colors"
                      >
                        {lang === "en" ? "🇬🇧 English" : lang === "hi" ? "🇮🇳 हिंदी" : "🇮🇳 मराठी"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              onClick={handleShare}
              className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t("schemes.share")}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Search criteria summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 glass-card rounded-xl p-4 border border-border/50"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {t("search.criteria")}
          </p>
          <div className="flex flex-wrap gap-3">
            {profile.district && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 text-foreground text-xs font-semibold border border-primary/30">
                📍 {t("search.district")}: {getDistrictName(profile.district, language)}
              </span>
            )}
            {profile.farmerType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-foreground text-xs font-semibold border border-emerald-500/30">
                🧑‍🌾 {t("search.farmerType")}: {t(`profile.${profile.farmerType}`)}
              </span>
            )}
            {profile.landOwnership && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-foreground text-xs font-semibold border border-amber-500/30">
                🏠 {t("search.landOwnership")}: {t(`profile.${profile.landOwnership}`)}
              </span>
            )}
            {profile.crops.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/20 text-foreground text-xs font-semibold border border-cyan-500/30">
                🌾 {t("search.crops")}: {profile.crops.map((c) => t(`profile.${c}`)).join(", ")}
              </span>
            )}
            {profile.requirements.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 text-foreground text-xs font-semibold border border-purple-500/30">
                🎯 {t("search.requirements")}: {profile.requirements.map((r) => t(`profile.${r}`)).join(", ")}
              </span>
            )}
          </div>
        </motion.div>

        {/* Schemes grid */}
        <div className="space-y-4">
          {schemes.map((scheme, index) => (
            <motion.div
              key={scheme.scheme_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FloatingCard
                className={`p-0 overflow-hidden transition-all duration-300 ${expandedScheme === scheme.scheme_id ? 'ring-2 ring-primary' : ''}`}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedScheme(expandedScheme === scheme.scheme_id ? null : scheme.scheme_id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Confidence indicator */}
                    <div className="relative flex-shrink-0">
                      <svg className="w-16 h-16 -rotate-90">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                        <motion.circle
                          cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                          className={getConfidenceColor(scheme.confidence)}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: scheme.confidence / 100 }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          style={{ strokeDasharray: 176, strokeDashoffset: 176 - (176 * scheme.confidence) / 100 }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                        {scheme.confidence}%
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium text-white bg-gradient-to-r ${categoryColors[scheme.category] || 'from-gray-500 to-gray-600'}`}>
                          {scheme.category}
                        </span>
                        {scheme.confidence >= 90 && (
                          <span className="flex items-center gap-1 text-xs text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            {t("schemes.topMatch")}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-display text-foreground mb-1">{scheme.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 truncate">{scheme.fullName}</p>

                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gradient">{scheme.benefit}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowExplainer(showExplainer === scheme.scheme_id ? null : scheme.scheme_id);
                          }}
                          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                        >
                          <HelpCircle className="w-4 h-4" />
                          {t("schemes.whyEligible")}
                        </button>
                      </div>
                    </div>

                    <motion.div animate={{ rotate: expandedScheme === scheme.scheme_id ? 180 : 0 }} className="text-muted-foreground">
                      <ChevronDown className="w-6 h-6" />
                    </motion.div>
                  </div>

                  {/* Eligibility explainer */}
                  <AnimatePresence>
                    {showExplainer === scheme.scheme_id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20"
                      >
                        <p className="text-sm font-medium text-primary mb-2">{t("schemes.matchBecause")}</p>
                        <ul className="space-y-1">
                          {scheme.matchReasons.map((reason, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedScheme === scheme.scheme_id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-6 space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("schemes.aboutScheme")}</h4>
                          <p className="text-foreground">{scheme.description}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("schemes.requiredDocs")}</h4>
                          <ul className="space-y-2">
                            {scheme.eligibility.map((doc, i) => (
                              <li key={i} className="flex items-center gap-2 text-foreground">
                                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("schemes.howToApply")}</h4>
                          <p className="text-foreground">{scheme.howToApply}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                          {scheme.applicationLink.startsWith("http") && (
                            <motion.a
                              href={scheme.applicationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-hero py-3 px-6 text-sm flex items-center gap-2 no-underline"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {t("schemes.applyNow")}
                              <ExternalLink className="w-4 h-4" />
                            </motion.a>
                          )}
                          <motion.button
                            onClick={() => openLearnMore(scheme)}
                            className="btn-secondary py-3 px-6 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {t("schemes.learnMore")}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FloatingCard>
            </motion.div>
          ))}
        </div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: schemes.length * 0.1 + 0.2 }}
          className="mt-8"
        >
          <FloatingCard className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-display text-foreground mb-1">{t("schemes.totalMatched")}</h3>
                <p className="text-sm text-muted-foreground">{t("schemes.basedOnProfile")} {profile.district || t("profile.maharashtra")}</p>
              </div>
              <div className="text-3xl font-bold text-gradient">
                {schemes.length} {t("schemes.schemesLabel")}
              </div>
            </div>
          </FloatingCard>
        </motion.div>
      </div>

      {/* Learn More Modal — with scraped detail */}
      <AnimatePresence>
        {detailScheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => { setDetailScheme(null); setScrapedData(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold font-display text-foreground">{detailScheme.name}</h3>
                  <p className="text-sm text-muted-foreground">{detailScheme.fullName}</p>
                </div>
                <button onClick={() => { setDetailScheme(null); setScrapedData(null); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scheme base info */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <h4 className="font-medium text-foreground mb-1">💰 {t("pdf.benefit")}</h4>
                  <p className="text-sm text-foreground font-semibold">{detailScheme.benefit}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{t("pdf.eligibility")}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{detailScheme.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{t("schemes.requiredDocs")}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {detailScheme.eligibility.map((doc, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{t("schemes.howToApply")}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{detailScheme.howToApply}</p>
                </div>
              </div>

              {/* Scraped data section */}
              {isScrapingLoading && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">{t("schemes.fetchingDetails") || "Fetching details..."}</span>
                </div>
              )}

              {scrapedData && !scrapedData.error && (
                <div className="border-t border-border pt-4 space-y-4">
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Additional Details from Official Source
                  </h4>

                  {/* Scraped sections */}
                  {scrapedData.sections?.slice(0, 4).map((section, i) => (
                    <div key={i} className="text-sm">
                      {section.heading && <p className="font-semibold text-foreground mb-1">{section.heading}</p>}
                      <p className="text-muted-foreground whitespace-pre-line line-clamp-4">{section.content}</p>
                    </div>
                  ))}

                  {/* Apply Links found by scraper */}
                  {scrapedData.apply_links && scrapedData.apply_links.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <h5 className="text-sm font-semibold mb-2">Links Found on Website:</h5>
                      <div className="flex flex-col gap-2">
                        {scrapedData.apply_links.slice(0, 3).map((link, i) => (
                          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {link.text || 'Apply Link'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                    Source: <a href={scrapedData.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate inline-block max-w-xs align-bottom">{scrapedData.source_url}</a>
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border mt-6">
                {detailScheme.applicationLink.startsWith("http") && (
                  <a
                    href={detailScheme.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hero py-2.5 px-6 text-sm flex-1 text-center flex justify-center items-center gap-2 no-underline"
                  >
                    {t("schemes.applyNow")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => { setDetailScheme(null); setScrapedData(null); }}
                  className="btn-secondary py-2.5 px-6 text-sm flex-1"
                >
                  {t("common.close") || "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchemesStep;
