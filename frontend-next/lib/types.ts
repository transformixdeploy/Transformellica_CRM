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
    pageSpeedScore: number,
    internalLinks: number,
    externalLinks: number,
    contentInfo: {
        imagesCount: number,
        imagesMissingAltTage: number
    },
    pageInfo: {
        title: string,
        titleLength: number,
        metaDescription: string,
        metaDescriptionLength: number,
        https: boolean,
        canonicalUrl: string
    },
    headingStructure: {
        h1Tages: string[],
        h2Tages: string[],
        h3Tages: string[],
        h4Tages: string[],
        h5Tages: string[],
        h6Tages: string[]
    },
    schemaMarkup: string[],
    socialLinks: string[],
    openGraphTags: {
        title: string,
        description: string,
        url: string,
        type: string,
        siteName: string
    },
    summary: string,
    fullSocialAnalysis: string
}

interface SocialSWOTData {
    analysisTitle: string,
    followers: number,
    following: number,
    engagementRate: number,
    profileInfo: {
      basicInfo: {
        name: string,
        bio: string,
        verified: boolean,
        private: boolean,
        website: string
      },
      additionalMetrics: {
        postsCount: number,
        averageLikes: number,
        averageComments: number,
        EngagementPerPost: number
      }
    },
    topHashTags: HashtagData[], 
    fullSocialAnalysis: string,
    competitiveAnalysis: string[]
}

interface HashtagData {
  tag: string;
  frequency: number;
}

interface SentimentData {
    analysisTitle: string,
    competitorsAnalyzedNumber: number,
    totalReview: number,
    avgGoogleRating: number,
    competitorsAnalyzed: CompetitorsAnalyzed[],
    competitorsDetails: CompetitorsDetails[],
    competitorSentimentComparisonChart: CompetitorSentimentComparisonChart[],
    competitorRating_averageSentiment_chart: CompetitorsRatings[],
    pieChart: {
        title: string,
        positive: number,
        negative: number,
        neutral: number
    },
    reviewsAnalyzedPerCompetitor: ReviewsPerCompetitor[]
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
        dominanColor: string,
        colors: string[]
    },
    executiveSummary: string,
    overallBrandIdentity_firstImpression: {
        strengths: string[],
        roomForImprovement: string[]
    },
    visualBrandingElements: {
        colorPalette: {
            analysis: string,
            recommendations: string[]
        },
        typography: {
            analysis: string,
            recommendations: string[]
        }
    },
    messaging_content_style: {
        content: string,
        recommendations: string[]
    },
    highlights_stories: {
        analysis: string,
        recommendations: string[]
    },
    gridStrategy: {
        analysis: string,
        recommendations: string[]
    },
    scores: Scores[],
    websiteImage: {
        data: string, // Placeholder for base64 data
        mimeType: string
    },
    instaImage: {
        data: string, // Placeholder for base64 data
        mimeType: string
    },
    logoImage: {
        data: string, // Placeholder for base64 data
        mimeType: string
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