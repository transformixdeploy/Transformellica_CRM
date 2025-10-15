import axios from 'axios';
import testData from '../utils/TestData.js';
import JSendResponser from '../utils/JSendResponser.js';
import HttpStatusCode from '../utils/HttpStatusCode.js';
import HttpStatusMessage from '../utils/HttpStatusMessage.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const websiteSWOT = asyncWrapper(
    async (req,res,next)=>{
        const {business_description, company_name, country, goal, website_url} = req.body;
      
        if(process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/website-swot-analysis`, {
                business_description,
                company_name,
                country,
                goal,
                website_url
            });
            
            return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
        }
        
        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, testData.websiteSWOTTestData);
    }
);

const sentimentAnalysis = asyncWrapper(
    async (req,res,next)=>{
        const {company_name, business_description, goal, country, industry_field} = req.body;
        
        if(process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/customer-sentiment-analysis`, {
              business_description,
              company_name,
              country,
              goal,
              industry_field
            });
          
            return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
        }
        
        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, testData.sentimentTestData);
    }
);

const socialSWOT = asyncWrapper(
    async (req,res,next)=>{
        const {business_description, company_name, country, goal, instagram_link} = req.body;  
      
        if(process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/social-swot-analysis`, {
              business_description,
              company_name,
              country,
              goal,
              instagram_link
            });
          
            return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
        }
        
        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, testData.socialSWOTTestData);
    }
);

const brandingAudit = asyncWrapper(
    async (req,res,next)=>{
        const logoUpload = req.file;
        const {business_description, company_name, country, goal, website_url, instagram_link} = req.body;
    
        const file = new File([logoUpload.buffer], logoUpload.originalname, {
            type: logoUpload.mimetype,
        })
        
        if(process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            const formData = new FormData();
            formData.append("logoUpload" , file);
            formData.append("business_description" , business_description);
            formData.append("company_name" , company_name);
            formData.append("country" , country);
            formData.append("goal" , goal);
            formData.append("website_url" , website_url);
            formData.append("instagram_link" , instagram_link);
            
            const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/branding-audit`, formData);
            return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
            // const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/branding-audit`, formData, {headers: formData.getHeaders()});
        }
        
        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, testData.brandAuditTestData); 
    }
);

export default {
    websiteSWOT,
    sentimentAnalysis,
    socialSWOT,
    brandingAudit
}