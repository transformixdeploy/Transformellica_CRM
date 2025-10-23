import { BrandingAuditData, CrmCardsData, CrmDashboardData, CrmPatternCardsData, CrmPatternsData, CrmSmartAnswerData, DisplayTableData, SentimentData, SmartQuestion, SocialSWOTData, UserLoginDTO, UserRegisterDTO, WebsiteSWOTData } from "@/lib/types";
import axios, { AxiosResponse } from "axios";

const baseBackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

function responseFormat(response: AxiosResponse){
    return response.data;
}

async function register(userRegisterDTO : UserRegisterDTO) : Promise<{status: string, data: {accessToken:string}}>{
    return responseFormat(await axios.post(`${baseBackendURL}/auth/register`, userRegisterDTO, {withCredentials: true}));
}

async function logout() : Promise<{status: string, data : null}>{
    return responseFormat(await axios.get(`${baseBackendURL}/auth/logout`, {withCredentials: true}));
}

async function refresh() : Promise<{status: string, data:{accessToken:string}}>{
    return responseFormat(await axios.get(`${baseBackendURL}/auth/refresh`, {withCredentials: true}));
}

async function login(userLoginDTO: UserLoginDTO): Promise<{status: string, data: {accessToken:string}}>{
    return responseFormat(await axios.post(`${baseBackendURL}/auth/login`, userLoginDTO, {withCredentials: true}));
}

async function checkTable() : Promise<{status: string, data:{ status: boolean }}>{
    return responseFormat(await axios.get(`${baseBackendURL}/crm/table`));
}

async function getSmartQuestions() : Promise<{status: string, data: SmartQuestion[]}>{
    return responseFormat(await axios.get(`${baseBackendURL}/crm/smart-question`));
}

async function answerQuestion(question: string) : Promise<{status: string, data:CrmSmartAnswerData}>{
    return responseFormat(await axios.post(`${baseBackendURL}/crm/smart-question`, {question}));   
}

async function getDashboardData(): Promise<{status: string, data: CrmDashboardData}>{
    return responseFormat(await axios.get(`${baseBackendURL}/crm/dashboard`));
}

async function getDisplayTableData(currentPage: number) : Promise<{status:string, data:DisplayTableData}>{
    return responseFormat(await axios.get(`${baseBackendURL}/crm/data?page=${currentPage}&limit=10`));
}

async function getDashboardDisplayCards() : Promise<{status: string, data:CrmCardsData}>{
    return responseFormat(await axios.get(`${baseBackendURL}/crm/display-cards`));
}

async function uploadCSVData(formData: FormData) : Promise<{status: string, data:CrmCardsData}>{
    return responseFormat(await axios.post(`${baseBackendURL}/crm/data`, formData));
}

async function deleteCSVData(){
    return responseFormat(await axios.delete(`${baseBackendURL}/crm/table`));
}

async function checkForPatterns() : Promise<{
    status: string, 
    data: {
        transactionalPatternsDetected: boolean,
        data: CrmPatternCardsData
    }
}>{
    return responseFormat(await axios.get(`${baseBackendURL}/crm/pattern-analysis`));
}

async function analysePatterns(minSupport: number) : Promise<{
    status: string, 
    data: {
        foundPatterns: boolean,
        issueIfNoPatternsFound: string,
        data: CrmPatternsData
    }
}>{
    return responseFormat(await axios.post(`${baseBackendURL}/crm/pattern-analysis`, {minSupport}));
}

async function getWebsiteSWOTData(form: {}, accessToken: string) : Promise<{status: string, data: WebsiteSWOTData}>{
    return responseFormat(await axios.post(`${baseBackendURL}/social/website-swot`, form , {
        withCredentials:true, 
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }));
}

async function getSocialSWOTData(form: {}, accessToken: string) : Promise<{status: string, data: SocialSWOTData}>{
    return responseFormat(await axios.post(`${baseBackendURL}/social/social-swot`, form , {
        withCredentials:true, 
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }));
}

async function getSentimentAnalysisData(form: {}, accessToken: string) : Promise<{status: string, data: SentimentData }>{
    return responseFormat(await axios.post(`${baseBackendURL}/social/sentiment-analysis`, form , {
        withCredentials:true, 
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }));
}

async function getBrandAuditData(form: FormData, accessToken: string) : Promise<{status: string, data: BrandingAuditData}>{
    return responseFormat(await axios.post(`${baseBackendURL}/social/branding-audit`, form , {
        withCredentials:true, 
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }));
}

async function checkServiceLimitReached(accessToken: string, userDataCategory: string) : Promise<boolean>{
    
    const response = await axios.post(`${baseBackendURL}/social/serviceLimitReached`, {category: userDataCategory}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });    
    
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