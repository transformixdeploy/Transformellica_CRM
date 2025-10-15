import { BarChartBig, Globe, Brain, Palette, Image as ImageIcon, LucideIcon } from 'lucide-react';


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
  social_media_swot: Question[];
  website_audit_swot: Question[];
  customer_sentiment: Question[];
  branding_audit: Question[];
  [key: string]: Question[];
}

// All the services we provide
export const services: Service[] = [
  { id: 'social_media_swot', name: 'Social media performance analytics', icon: BarChartBig, description: "Analyze social media strengths, weaknesses, opportunities, threats.", iconClassName: "w-6 h-6 mb-1 text-primary" },
  { id: 'website_audit_swot', name: 'Website optimization analytics', icon: Globe, description: "SWOT analysis of website performance and structure.", iconClassName: "w-6 h-6 mb-1 text-primary" },
  { id: 'customer_sentiment', name: 'Customer Sentiment Analysis', icon: Brain, description: "Understand customer perception from online reviews.", iconClassName: "w-6 h-6 mb-1 text-primary" },
  { id: 'branding_audit', name: 'Branding Audit', icon: Palette, description: "Evaluate brand identity, consistency, and positioning.", iconClassName: "w-6 h-6 mb-1 text-primary" },
];

// Questions specific for each service
export const questionsConfig: QuestionsConfig = {
  common: [
    { id: 'companyName', label: "Company Name?", type: 'text', placeholder: "e.g., Transformix Inc.", required: true },
    { id: 'businessDescription', label: "Business Description (for a 6th grader)?", type: 'textarea', placeholder: "e.g., We help businesses grow online!", required: true },
    { id: 'goal', label: "Main Goal for this Analysis?", type: 'text', placeholder: "e.g., Increase engagement", required: true },
    { id: 'country', label: "Primary Target Audience Country?", type: 'text', placeholder: "e.g., United States", required: true },
  ],
  social_media_swot: [
    { id: 'instagramLink', label: "Instagram Profile Link?", type: 'url', placeholder: "https://instagram.com/yourprofile", required: true },
  ],
  website_audit_swot: [
    { id: 'websiteUrl', label: "Company Website URL?", type: 'url', placeholder: "https://yourcompany.com", required: true },
  ],
  customer_sentiment: [
    { id: 'industry', label: "What industry is your business in?", type: 'text', placeholder: "e.g., Retail, Technology, Healthcare", required: true },
  ],
  branding_audit: [
    { id: 'logoUpload', label: "Upload Company Logo", type: 'file', accept: 'image/*', required: true, icon: ImageIcon, iconClassName: "w-4 h-4 mr-2" },
    { id: 'websiteUrl', label: "Company Website URL?", type: 'url', placeholder: "https://yourcompany.com", required: true },
    { id: 'instagramLink', label: "Instagram Profile Link?", type: 'url', placeholder: "https://instagram.com/yourprofile", required: true },
  ],
};

// function to return array of questions based on service-id
export const getQuestionsForService = (serviceId: string): Question[] => {
  let serviceQuestions: Question[] = [];
  const commonQuestions: Question[] = JSON.parse(JSON.stringify(questionsConfig.common)); 

  if (serviceId === 'all_in_one') {
    serviceQuestions = [
      ...questionsConfig.social_media_swot,
      ...questionsConfig.website_audit_swot,
      ...questionsConfig.customer_sentiment.filter(q => q.id !== 'websiteUrlSentiment'), 
      ...questionsConfig.branding_audit,
    ];
    
    const websiteUrlFromWebsiteAudit = questionsConfig.website_audit_swot.find(q => q.id === 'websiteUrl');
    if (websiteUrlFromWebsiteAudit) {
        const existingWebsiteQuestion = serviceQuestions.find(q => q.id === 'websiteUrl');
        if(!existingWebsiteQuestion) {
            serviceQuestions.unshift(websiteUrlFromWebsiteAudit);
        }
    }

    const uniqueQuestions: Question[] = [];
    const questionIds = new Set<string>();
    for (const q of serviceQuestions) {
      if (!questionIds.has(q.id)) {
        uniqueQuestions.push(q);
        questionIds.add(q.id);
      }
    }
    serviceQuestions = uniqueQuestions;
  } else {
    serviceQuestions = questionsConfig[serviceId] ? [...questionsConfig[serviceId]] : [];
  }
  
  if (serviceId === 'social_media_swot') {
     const businessDescriptionSocial = commonQuestions.find(q => q.id === 'businessDescription');
     if (businessDescriptionSocial) {
        businessDescriptionSocial.label = "Business Description?";
     }
  }


  return [...commonQuestions, ...serviceQuestions];
};
