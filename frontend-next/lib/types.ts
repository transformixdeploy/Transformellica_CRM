import { LucideIcon } from "lucide-react";

interface Step {
    icon: LucideIcon,
    title: string;
    description: string;
}

interface UserLoginDTO {
    email: string,
    password: string,
}

interface UserRegisterDTO {
    fullName: string,
    email: string,
    password: string,
    phoneNumber: string,
    companyName: string,
    jobRole: string,
    websiteURL?: string | null
}

interface AxiosError {
    response: {
        data: {
            status: string,
            data? : { 
                message: string
            },
            message?: string
        }
    }
}

interface CrmDashboardData {
    keyBusinessInsights: {
        primaryInsights: string[],
        quickStats: KeyValue[]
    },
    keyPerformanceMetrics: PerformanceMetric[],
    businessRecommendations: { 
        actionableInsights: string[], 
        nextSteps: string[]
    },
    analytics: AnalyticRow[],
    lineChart: boolean,
    barChart: boolean,
    pieChart: boolean,
    donutChart: boolean,
    lineChartData: { 
        title: "", 
        data: CharPointtData[]
    },
    barChartData: { 
        title: string, 
        data: CharPointtData[]
    },
    pieChartData: { 
        title: string, 
        colorCodes: string[],  
        data: CharPointtData[] 
    },
    donutChartData: { 
        title: string, 
        colorCodes: string[], 
        data: CharPointtData[]
    }
}

interface AnalyticRow {
    name: string, 
    count: number, 
    mean: number, 
    std: number, 
    min: number, 
    twentyFivePercent: number, 
    fiftyPercent: number, 
    seventyFivePercent: number, 
    max: number
}

interface KeyValue {
    key: string, 
    value: string
}

interface PerformanceMetric {
    number: number, 
    title: string, 
    description: string
}

interface CharPointtData {
    name: string,
    value: number
}

interface SmartQuestion {
    title: string , 
    question: string
}

interface CrmSmartAnswerData {
    smartAnalysis: {
        analysis: string, 
        confidence: number
    },
    keyFindings: string[],
    relevantStatistics: KeyValue[],
    dataEvidence: {
        evidences: string[], 
        confidence: string
    },
    actionableInsights: KeyValue[],
    followUpQuestions: string[]
}

interface CrmCardsData {
    domain: string,
    missing_data_ratio: number,
    num_numeric_columns: number,
    total_columns: number,
    total_rows: number
}

interface CrmPatternCardsData {
    transactionsFound: number, 
    avgItemsPerTransaction: number
}

interface DisplayTableData {
    rows: Record<string, any>[],
    totalCount: number,
    lastPage: number
}

interface CrmPatternsData {
    significantPatternsCount: string,
    topAssociationPatterns: Patterns[],
    businessInsights: {
        keyFindings: string[],
        recommendations: string[]
    }
}

interface Patterns {
    whenWeSee: string, 
    weOftenFind: string, 
    confidence: number, 
    lift: number
}

interface WebsiteSWOTData {
    pageSpeedScore: number | null,
    internalLinks: number | null,
    externalLinks: number | null,
    contentInfo: {
        imagesCount: number | null,
        imagesMissingAltTage: number | null
    },
    pageInfo: {
        title: string | null,
        titleLength: number | null,
        metaDescription: string | null,
        metaDescriptionLength: number | null,
        https: boolean | null,
        canonicalUrl: string | null
    },
    headingStructure: {
        h1Tages: string[] | null,
        h2Tages: string[] | null,
        h3Tages: string[] | null,
        h4Tages: string[] | null,
        h5Tages: string[] | null,
        h6Tages: string[] | null
    },
    schemaMarkup: string[] | null,
    socialLinks: string[] | null,
    openGraphTags: {
        title: string | null,
        description: string | null,
        url: string | null,
        type: string | null,
        siteName: string | null
    },
    summary: string | null,
    fullSocialAnalysis: string | null
}

interface SocialSWOTData {
    analysisTitle: string | null,
    followers: number | null,
    following: number | null,
    engagementRate: number | null,
    profileInfo: {
        basicInfo: {
            name: string | null,
            bio: string | null,
            verified: boolean | null,
            private: boolean | null,
            website: string | null
        },
        additionalMetrics: {
            postsCount: number | null,
            averageLikes: number | null,
            averageComments: number | null,
            EngagementPerPost: number | null
        }
    },
    topHashTags: HashtagData[] | null, 
    fullSocialAnalysis: string | null,
    competitiveAnalysis: string[] | null
}

interface HashtagData {
  tag: string;
  frequency: number;
}

interface SentimentData {
    analysisTitle: string | null,
    competitorsAnalyzedNumber: number | null,
    totalReview: number | null,
    avgGoogleRating: number | null,
    competitorsAnalyzed: CompetitorsAnalyzed[] | null,
    competitorsDetails: CompetitorsDetails[] | null,
    competitorSentimentComparisonChart: CompetitorSentimentComparisonChart[] | null,
    competitorRating_averageSentiment_chart: CompetitorsRatings[] | null,
    pieChart: {
        title: string | null,
        positive: number | null,
        negative: number | null,
        neutral: number | null
    },
    reviewsAnalyzedPerCompetitor: ReviewsPerCompetitor[] | null
}

interface CompetitorsAnalyzed {
    name: string,
    googleRating: number,
    reviewsAnalyzed: number,
    positivePercentage: number,
    negativePercentage: number,
    avgSentiment: number
}

interface CompetitorsDetails {
    address: string,
    googleMaps: string,
    aiInsights: string
}

interface CompetitorSentimentComparisonChart { 
    name: string, 
    negative: number, 
    positive: number, 
    neutral: number 
}

interface CompetitorsRatings { 
    googleRating: number, 
    averageSentiment: number, 
    competitorName: string 
}

interface ReviewsPerCompetitor { 
    name: string, 
    reviews: number 
}

interface BrandingAuditData {
    brandColors: {
        dominanColor: string | null,
        colors: string[] | null
    },
    executiveSummary: string | null,
    overallBrandIdentity_firstImpression: {
        strengths: string[] | null,
        roomForImprovement: string[] | null
    },
    visualBrandingElements: {
        colorPalette: {
            analysis: string | null,
            recommendations: string[] | null
        },
        typography: {
            analysis: string | null,
            recommendations: string[] | null
        }
    },
    messaging_content_style: {
        content: string | null,
        recommendations: string[] | null
    },
    highlights_stories: {
        analysis: string | null,
        recommendations: string[] | null
    },
    gridStrategy: {
        analysis: string | null,
        recommendations: string[] | null
    },
    scores: Scores[] | null,
    websiteImage: {
        data: string | null, // Placeholder for base64 data
        mimeType: string | null
    },
    instaImage: {
        data: string | null, // Placeholder for base64 data
        mimeType: string | null
    },
    logoImage: {
        data: string | null, // Placeholder for base64 data
        mimeType: string | null
    }
}

interface Scores { 
    title: string, 
    score: number 
}

export type {
    Step,
    WebsiteSWOTData,
    SocialSWOTData,
    SentimentData,
    BrandingAuditData,
    CrmDashboardData,
    SmartQuestion,
    CrmSmartAnswerData,
    CrmCardsData,
    DisplayTableData,
    CrmPatternCardsData,
    CrmPatternsData,
    UserLoginDTO,
    UserRegisterDTO,
    AxiosError
}