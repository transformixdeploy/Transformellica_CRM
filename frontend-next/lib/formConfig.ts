// Modified "formConfig.ts"
import { Globe, Brain, Palette, Image as ImageIcon, LucideIcon, Video, Instagram, Zap} from 'lucide-react';

// Service Interface
export interface Service {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  iconClassName?: string;
}

// Question Interface
export interface Question {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'file';
  placeholder?: string;
  required: boolean;
  accept?: string;
  icon?: LucideIcon;
  iconClassName?: string;
}

// A map that maps service-id to its related questions (each key is mapped to array of questions)
interface QuestionsConfig {
  common: Question[];
  instagram_analysis: Question[];
  tiktok_analysis: Question[];
  website_audit_swot: Question[];
  customer_sentiment: Question[];
  branding_audit: Question[];
  all_social_analysis: Question[];
  [key: string]: Question[];
}

// All the services we provide
export const services: Service[] = [
  { id: 'website_audit_swot', name: 'Website optimization analytics', icon: Globe, description: "SWOT analysis of website performance and structure.", iconClassName: "w-6 h-6 mb-1 text-primary" },
  { id: 'customer_sentiment', name: 'Customer Sentiment Analysis', icon: Brain, description: "Understand customer perception from online reviews.", iconClassName: "w-6 h-6 mb-1 text-primary" },
  { id: 'branding_audit', name: 'Branding Audit', icon: Palette, description: "Evaluate brand identity, consistency, and positioning.", iconClassName: "w-6 h-6 mb-1 text-primary" },
  { id: 'instagram_analysis', name: 'Instagram performance analytics', icon: Instagram, description: "Analyze Instagram strengths, weaknesses, opportunities, threats.", iconClassName: "w-6 h-6 mb-1 text-primary" },
  { id: 'tiktok_analysis', name: 'TikTok performance analytics', icon: Video, description: "Analyze TikTok strengths, weaknesses, opportunities, threats.", iconClassName: "w-6 h-6 mb-1 text-primary" },
  { id: 'all_social_analysis', name: 'All in one', icon: Zap, description: "Comprehensive social media analysis for optimized strategy and maximum impact.", iconClassName: "w-6 h-6 mb-1 text-primary"},
];

// Social Analysis questions
const tiktok_analysis_questions: Question[] = [
  { id: 'tiktokLink', label: "TikTok Profile Link", type: 'url', placeholder: "https://tiktok.com/@yourprofile", required: true },
]
const instagram_analysis_questions: Question[] = [
  { id: 'instagramLink', label: "Instagram Profile Link", type: 'url', placeholder: "https://instagram.com/yourprofile", required: true },
]
const all_social_analysis_questions: Question[] = [
  ...tiktok_analysis_questions,
  ...instagram_analysis_questions
]

// Questions specific for each service
export const questionsConfig: QuestionsConfig = {
  common: [
    { id: 'companyName', label: "Company Name", type: 'text', placeholder: "e.g., Transformix Inc.", required: true },
    { id: 'businessDescription', label: "Business Description (for a 6th grader)", type: 'textarea', placeholder: "e.g., We help businesses grow online!", required: true },
    { id: 'goal', label: "Main Goal for this Analysis", type: 'text', placeholder: "e.g., Increase engagement", required: true },
    { id: 'country', label: "Primary Target Audience Country", type: 'text', placeholder: "e.g., United States", required: true },
  ],
  website_audit_swot: [
    { id: 'websiteUrl', label: "Company Website URL", type: 'url', placeholder: "https://yourcompany.com", required: true },
  ],
  customer_sentiment: [
    { id: 'industry', label: "What industry is your business in", type: 'text', placeholder: "e.g., Retail, Technology, Healthcare", required: true },
  ],
  branding_audit: [
    { id: 'logoUpload', label: "Upload Company Logo", type: 'file', accept: 'image/*', required: true, icon: ImageIcon, iconClassName: "w-4 h-4 mr-2" },
    { id: 'websiteUrl', label: "Company Website URL", type: 'url', placeholder: "https://yourcompany.com", required: true },
    { id: 'instagramLink', label: "Instagram Profile Link", type: 'url', placeholder: "https://instagram.com/yourprofile", required: true },
  ],
  instagram_analysis: instagram_analysis_questions,
  tiktok_analysis: tiktok_analysis_questions,
  all_social_analysis: all_social_analysis_questions
};

// function to return array of questions based on service-id
export const getQuestionsForService = (serviceId: string): Question[] => {
  let serviceQuestions: Question[] = [];
  const commonQuestions: Question[] = questionsConfig.common;
  serviceQuestions = questionsConfig[serviceId] ? [...questionsConfig[serviceId]] : [];
  return [...commonQuestions, ...serviceQuestions];
};