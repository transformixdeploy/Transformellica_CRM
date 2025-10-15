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

const localStorageDataNames = {
    WEBSITE_SWOT: "websiteSwotData",
    SENTIMENT_ANALYSIS: "sentimentAnalysisData",
    SOCIAL_MEDIA_SWOT: "socialMediaSwotData",
    BRANDING_AUDIT: "brandingAuditData" 
}

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
    pageSpeedScore: 0,
    internalLinks: 0,
    externalLinks: 0,
    contentInfo: {
        imagesCount: 0,
        imagesMissingAltTage: 0
    },
    pageInfo: {
        title: "",
        titleLength: 0,
        metaDescription: "",
        metaDescriptionLength: 0,
        https: false,
        canonicalUrl: ""
    },
    headingStructure: {
        h1Tages: [""],
        h2Tages: [""],
        h3Tages: [""],
        h4Tages: [""],
        h5Tages: [""],
        h6Tages: [""]
    },
    schemaMarkup: [""],
    socialLinks: [""],
    openGraphTags: {
        title: "",
        description: "",
        url: "",
        type: "",
        siteName: ""
    },
    summary: "",
    fullSocialAnalysis: ""
}

const socialSWOTData : SocialSWOTData = {
    analysisTitle: "",
    followers: 0,
    following: 0,
    engagementRate: 0,
    profileInfo: {
      basicInfo: {
        name: "",
        bio: "",
        verified: false,
        private: true,
        website: ""
      },
      additionalMetrics: {
        postsCount: 0,
        averageLikes: 0,
        averageComments: 0,
        EngagementPerPost: 0
      }
    },
    topHashTags: [
      { tag: "", frequency: 0 }
    ],
    fullSocialAnalysis: "",
    competitiveAnalysis: [""]
}

const sentimentData : SentimentData = {
    analysisTitle: "",
    competitorsAnalyzedNumber: 0,
    totalReview: 0,
    avgGoogleRating: 0,
    competitorsAnalyzed: [
        {
            name: "",
            googleRating: 0,
            reviewsAnalyzed: 0,
            positivePercentage: 0,
            negativePercentage: 0,
            avgSentiment: 0
        }
    ],
    competitorsDetails: [
        {
            address: "",
            googleMaps: "",
            aiInsights: ""
        }
    ],
    competitorSentimentComparisonChart: [
        { name: "", negative: 0, positive: 0, neutral: 0 }
    ],
    competitorRating_averageSentiment_chart: [
        { googleRating: 0, averageSentiment: 0, competitorName: "" }
    ],
    pieChart: {
        title: "",
        positive: 0,
        negative: 0,
        neutral: 0
    },
    reviewsAnalyzedPerCompetitor: [
        { name: "", reviews: 0 },
    ]
}

const brandingAuditData : BrandingAuditData = {
    brandColors: {
        dominanColor: "",
        colors: [""]
    },
    executiveSummary: "",
    overallBrandIdentity_firstImpression: {
        strengths: [""],
        roomForImprovement: [""]
    },
    visualBrandingElements: {
        colorPalette: {
            analysis: "",
            recommendations: [""]
        },
        typography: {
            analysis: "",
            recommendations: [""]
        }
    },
    messaging_content_style: {
        content: "",
        recommendations: []
    },
    highlights_stories: {
        analysis: "",
        recommendations: [""]
    },
    gridStrategy: {
        analysis: "",
        recommendations: [""]
    },
    scores: [
        { title: "", score: 0 },
    ],
    websiteImage: {
        data: "", // Placeholder for base64 data
        mimeType: ""
    },
    instaImage: {
        data: "", // Placeholder for base64 data
        mimeType: ""
    },
    logoImage: {
        data: "", // Placeholder for base64 data
        mimeType: ""
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

export {
    localStorageDataNames,
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
    axiosResponseStatus
}