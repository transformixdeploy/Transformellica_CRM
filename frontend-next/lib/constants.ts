import {FileInputIcon, 
  CpuIcon,
  FileTextIcon, 
  MailIcon, 
  CheckCircleIcon, 
  ChartAreaIcon, 
  UploadIcon, 
  BotIcon, 
  TrendingUpIcon, 
  DatabaseIcon, 
  LayoutDashboardIcon 
} from "lucide-react";
import { BrandingAuditData, CrmCardsData, CrmDashboardData, CrmPatternCardsData, CrmPatternsData, CrmSmartAnswerData, SentimentData, SocialSWOTData, Step, WebsiteSWOTData } from "./types";
import { Variants } from "framer-motion";

const crmDashboardData : CrmDashboardData  = {
keyBusinessInsights: {
    primaryInsights: [""],
    quickStats: [{key: "", value: ""}]
},
keyPerformanceMetrics: [{number: 0, title: "", description: ""}],
businessRecommendations: { actionableInsights: [""], nextSteps: [""]},
analytics: [ {name: "", count: 0, mean: 0, std: 0, min: 0, twentyFivePercent: 0, fiftyPercent: 0, seventyFivePercent: 0, max: 0}],
lineChart: false,
barChart: false,
pieChart: false,
donutChart: false,
lineChartData: { title: "", data: [{name: "", value: 0}] },
barChartData: { title: "", data: [{name: "", value: 0}]},
pieChartData: { title: "", colorCodes: [""],  data: [{name: "", value: 0}] },
donutChartData: { title: "", colorCodes: [""], data: [{name: "", value: 0}] }
}

const crmSmartAnswerData : CrmSmartAnswerData = {
smartAnalysis: {analysis: "", confidence: 0},
keyFindings: [],
relevantStatistics: [{key: "", value: ""}],
dataEvidence: {evidences: [], confidence: ""},
actionableInsights: [{key: "", value: ""}],
followUpQuestions: []
}

const crmCardsData : CrmCardsData = {
domain: "",
missing_data_ratio: 0,
num_numeric_columns: 0,
total_columns: 0,
total_rows: 0
}

const crmPatternCardsData : CrmPatternCardsData = {
avgItemsPerTransaction: 0,
transactionsFound: 0
}

const crmPatternsData : CrmPatternsData = {
significantPatternsCount: "",
topAssociationPatterns: [{whenWeSee: "", weOftenFind: "", confidence: 0, lift: 0}],
businessInsights: {
    keyFindings: [],
    recommendations: []
}
}

const websiteSWOTData : WebsiteSWOTData = {
pageSpeedScore: null,
internalLinks: null,
externalLinks: null,
contentInfo: {
    imagesCount: null,
    imagesMissingAltTage: null
},
pageInfo: {
    title: null,
    titleLength: null,
    metaDescription: null,
    metaDescriptionLength: null,
    https: null,
    canonicalUrl: null
},
headingStructure: {
    h1Tages: null,
    h2Tages: null,
    h3Tages: null,
    h4Tages: null,
    h5Tages: null,
    h6Tages: null
},
schemaMarkup: null,
socialLinks: null,
openGraphTags: {
    title: null,
    description: null,
    url: null,
    type: null,
    siteName: null
},
summary: null,
fullSocialAnalysis: null
}

const socialSWOTData : SocialSWOTData = {
analysisTitle: null,
followers: null,
following: null,
engagementRate: null,
profileInfo: {
  basicInfo: {
    name: null,
    bio: null,
    verified: null,
    private: null,
    website: null
  },
  additionalMetrics: {
    postsCount: null,
    averageLikes: null,
    averageComments: null,
    EngagementPerPost: null
  }
},
topHashTags: null,
fullSocialAnalysis: null,
competitiveAnalysis: null
}

const sentimentData : SentimentData = {
  analysisTitle: null,
  competitorsAnalyzedNumber: null,
  totalReview: null,
  avgGoogleRating: null,
  competitorsAnalyzed: null,
  competitorsDetails: null,
  competitorSentimentComparisonChart: null,
  competitorRating_averageSentiment_chart: null,
  pieChart: {
      title: null,
      positive: null,
      negative: null,
      neutral: null
  },
  reviewsAnalyzedPerCompetitor: null
}

const brandingAuditData : BrandingAuditData = {
  brandColors: {
      dominanColor: null,
      colors: null
  },
  executiveSummary: null,
  overallBrandIdentity_firstImpression: {
      strengths: null,
      roomForImprovement: null
  },
  visualBrandingElements: {
      colorPalette: {
          analysis: null,
          recommendations: null
      },
      typography: {
          analysis: null,
          recommendations: null
      }
  },
  messaging_content_style: {
      content: null,
      recommendations: null
  },
  highlights_stories: {
      analysis: null,
      recommendations: null
  },
  gridStrategy: {
      analysis: null,
      recommendations: null
  },
  scores: null,
  websiteImage: {
      data: null, // Placeholder for base64 data
      mimeType: null
  },
  instaImage: {
      data: null, // Placeholder for base64 data
      mimeType: null
  },
  logoImage: {
      data: null, // Placeholder for base64 data
      mimeType: null
  }
}

const mainHowItWorksSteps: Step[] = [
{
  icon: FileInputIcon,
  title: '1. Submit Your Details',
  description: 'Fill out a simple form with your website URL and optionally, your primary social media profile link. We only need basic information to get started.',
},
{
  icon: CpuIcon,
  title: '2. AI Agent Gets to Work',
  description: 'Our intelligent n8n-powered AI agent immediately starts analyzing your provided online presence. It scrapes relevant data, evaluates performance metrics, and identifies key insights.',
},
{
  icon: ChartAreaIcon,
  title: '3. Comprehensive Analysis',
  description: 'The AI delves into various aspects, including website SEO basics, content engagement on social media, and overall digital footprint effectiveness.',
},
{
  icon: FileTextIcon,
  title: '4. PDF Report Generation',
  description: 'Once the analysis is complete, Transformellica compiles all findings into a professionally formatted, easy-to-understand PDF document.',
},
{
  icon: MailIcon,
  title: '5. Report Delivered to You',
  description: 'The final PDF report is automatically sent to the email address you provided, typically within minutes of your request.',
},
{
  icon: CheckCircleIcon,
  title: '6. Actionable Insights',
  description: 'Use your report to make data-driven decisions, optimize your strategies, and enhance your online performance. Simple, fast, and effective!',
},
];

const biHowItWorksSteps: Step[] = [
{
  icon: UploadIcon,
  title: '1. Submit Your Data',
  description: 'Fill out a simple form to upload your customer data as a CSV file. We only need your raw data to get started.',
},
{
  icon: BotIcon,
  title: '2. AI Agent Gets to Work',
  description: 'Our intelligent AI agent immediately begins processing your data. It fine-tunes itself with your information, learns your business\'s unique patterns, and prepares for in-depth analysis.',
},
{
  icon: DatabaseIcon,
  title: '3. Comprehensive Analysis',
  description: 'The AI delves into various aspects of your data, including performing market basket analysis to uncover product relationships and preparing to answer all your questions regarding your customers and sales.',
},
{
  icon: LayoutDashboardIcon,
  title: '4. Dashboard Generation',
  description: 'Once the analysis is complete, the assistant compiles all findings into a professionally formatted, easy-to-understand dashboard with charts, KPIs, and primary insights.',
},
{
  icon: TrendingUpIcon,
  title: '5. Dashboard Delivered to You',
  description: 'Your final interactive dashboard is automatically made available to you, typically within minutes of your data upload.',
},
{
  icon: CheckCircleIcon,
  title: '6. Actionable Insights',
  description: 'Use your dashboard and business recommendations to make data-driven decisions, optimize your strategies, and enhance your business performance. Simple, fast, and effective!',
},
];

const containerAnimationVariants: Variants = {
hidden: { opacity: 0 },
visible: {
    opacity: 1,
    transition: {
        staggerChildren: 0.1
    }
}
};

const itemAnimationVariants: Variants = {
hidden: { opacity: 0, y: 20 },
visible: {
    opacity: 1,
    y: 0,
    transition: {
        duration: 0.5,
        ease: "easeOut"
    }
}
};

const axiosResponseStatus = {
SUCCESS: "success",
FAIL: "fail",
ERROR: "error"
}

const userDataCategories = {
WEBSITE_SWOT: "websiteSWOT",
SOCIAL_SWOT: "socialSWOT",
SENTIMENT: "sentiment",
BRAND_AUDIT: "brandAudit",
CSV: "csv"
}

const historyTypes = {
  limited: "Limited",
  expanded: "Expanded"
}

const supportTypes = {
  standard: "Standard",
  priority: "Priority"
}

const planNames = {
  freePlane: "Free plan",
  explorer: "Explorer",
  grower: "Grower",
  salesGuru: "Sales Guru"
}

const planId = {
  freePlane: "free_plan",
  explorer: "explorer",
  grower: "grower",
  salesGuru: "sales_guru"
}

const plans = [
  {
    name: planNames.freePlane,
    id: planId.freePlane,
    bestFor: 'Invited users from the waitlist',
    price: 'Free for a limited time',
    reports: 4,
    history: historyTypes.limited,
    inviteOnly: true,
  },
  {
    name: planNames.explorer,
    id: planId.explorer,
    bestFor: 'Freelancers & early users',
    priceEGP: 299,
    reports: 30,
    history: historyTypes.limited,
    extraReport: 10,
    support: supportTypes.standard,
    highlights: 'Entry-level plan to explore core AI modules. No CRM. Ideal for testing value.',
  },
  {
    name: planNames.grower,
    id: planId.grower,
    bestFor: 'Marketing professionals',
    priceEGP: 999,
    reports: 200,
    history: historyTypes.expanded,
    modelMemory: true,
    extraReport: 5,
    support: supportTypes.priority,
    highlights: 'Best value per report. Includes AI model memory & enhanced insights for campaigns.',
    recommended: true,
  },
  {
    name: planNames.salesGuru,
    id: planId.salesGuru,
    bestFor: 'Sales pro / SMEs',
    priceEGP: 999,
    reports: 100,
    history: historyTypes.expanded,
    modelMemory: true,
    crm: true,
    crmNote: '(5K-row limit, RFM disabled)',
    extraReport: 5,
    support: supportTypes.priority,
    highlights: 'All modules + CRM access. Perfect for small teams managing customer data.',
  },
];

export {
  crmDashboardData,
  websiteSWOTData,
  socialSWOTData,
  sentimentData,
  brandingAuditData,
  mainHowItWorksSteps,
  biHowItWorksSteps,
  containerAnimationVariants,
  itemAnimationVariants,
  crmSmartAnswerData,
  crmCardsData,
  crmPatternCardsData,
  crmPatternsData,
  axiosResponseStatus,
  userDataCategories,
  planId,
  historyTypes,
  supportTypes,
  plans
}