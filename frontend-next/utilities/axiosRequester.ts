import { BrandingAuditData, CrmCardsData, CrmDashboardData, CrmPatternCardsData, CrmPatternsData, CrmSmartAnswerData, DisplayTableData, SentimentData, SmartQuestion, SocialSWOTData, UserLoginDTO, UserRegisterDTO, WebsiteSWOTData } from "@/lib/types";
import axios, { AxiosResponse } from "axios";
import { apiClient } from "./axiosApiClient";

const baseBackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

function responseFormat(response: AxiosResponse){
    return response.data;
}

async function logout() : Promise<{status: string, data : null}>{
    return responseFormat(await axios.get(`${baseBackendURL}/auth/logout`, {withCredentials: true}));
}

async function refresh() : Promise<{status: string, data:{accessToken:string}}>{
    return responseFormat(await axios.get(`${baseBackendURL}/auth/refresh`, {withCredentials: true}));
}

async function register(userRegisterDTO : UserRegisterDTO) : Promise<{status: string, data: {accessToken:string}}>{
    return responseFormat(await apiClient.post(`${baseBackendURL}/auth/register`, userRegisterDTO));
}

async function login(userLoginDTO: UserLoginDTO): Promise<{status: string, data: {accessToken:string}}>{
    return responseFormat(await apiClient.post(`${baseBackendURL}/auth/login`, userLoginDTO));
}

async function checkTable() : Promise<{status: string, data:{ status: boolean }}>{
    return responseFormat(await apiClient.get(`${baseBackendURL}/crm/table`));
}

async function getSmartQuestions() : Promise<{status: string, data: SmartQuestion[]}>{
    return responseFormat(await apiClient.get(`${baseBackendURL}/crm/smart-question`));
}

async function answerQuestion(question: string) : Promise<{status: string, data:CrmSmartAnswerData}>{
    return responseFormat(await apiClient.post(`${baseBackendURL}/crm/smart-question`, {question}));   
}

async function getDashboardData(): Promise<{status: string, data: CrmDashboardData}>{
    return responseFormat(await apiClient.get(`${baseBackendURL}/crm/dashboard`));
}

async function getDisplayTableData(currentPage: number) : Promise<{status:string, data:DisplayTableData}>{
    return responseFormat(await apiClient.get(`${baseBackendURL}/crm/data?page=${currentPage}&limit=10`));
}

async function getDashboardDisplayCards() : Promise<{status: string, data:CrmCardsData}>{
    return responseFormat(await apiClient.get(`${baseBackendURL}/crm/display-cards`));
}

async function uploadCSVData(formData: FormData) : Promise<{status: string, data:CrmCardsData}>{
    return responseFormat(await apiClient.post(`${baseBackendURL}/crm/data`, formData));
}

async function deleteCSVData(){
    return responseFormat(await apiClient.delete(`${baseBackendURL}/crm/table`));
}

async function checkForPatterns() : Promise<{
    status: string, 
    data: {
        transactionalPatternsDetected: boolean,
        data: CrmPatternCardsData
    }
}>{
    return responseFormat(await apiClient.get(`${baseBackendURL}/crm/pattern-analysis`));
}

async function analysePatterns(minSupport: number) : Promise<{
    status: string, 
    data: {
        foundPatterns: boolean,
        issueIfNoPatternsFound: string,
        data: CrmPatternsData
    }
}>{
    return responseFormat(await apiClient.post(`${baseBackendURL}/crm/pattern-analysis`, {minSupport}));
}

async function getWebsiteSWOTData(form: {}, accessToken: string) : Promise<{status: string, data: WebsiteSWOTData}>{
    return responseFormat(await apiClient.post(`/social/website-swot`, form));
}

async function getSocialSWOTData(form: {}, accessToken: string) : Promise<{status: string, data: SocialSWOTData}>{
    return responseFormat(await apiClient.post(`/social/social-swot`, form));
}

async function getSentimentAnalysisData(form: {}, accessToken: string) : Promise<{status: string, data: SentimentData }>{
    return responseFormat(await apiClient.post(`/social/sentiment-analysis`, form));
}

async function getBrandAuditData(form: FormData, accessToken: string) : Promise<{status: string, data: BrandingAuditData}>{
    return responseFormat(await apiClient.post(`/social/branding-audit`, form));
}

async function checkServiceLimitReached(accessToken: string, userDataCategory: string) : Promise<boolean>{
    const response = await apiClient.post(`/social/serviceLimitReached`, {category: userDataCategory});    
    return response.data.data.reached;
}



export {
    checkTable,
    getSmartQuestions,
    answerQuestion,
    getDashboardData,
    getDisplayTableData,
    getDashboardDisplayCards,
    uploadCSVData,
    deleteCSVData,
    checkForPatterns,
    analysePatterns,
    getWebsiteSWOTData,
    getSocialSWOTData,
    getSentimentAnalysisData,
    getBrandAuditData,
    login,
    refresh,
    logout,
    register,
    checkServiceLimitReached
}