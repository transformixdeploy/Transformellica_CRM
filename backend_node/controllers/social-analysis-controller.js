import axios from 'axios';
import testData from '../utils/TestData.js';
import JSendResponser from '../utils/JSendResponser.js';
import HttpStatusCode from '../utils/HttpStatusCode.js';
import HttpStatusMessage from '../utils/HttpStatusMessage.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import {UserData, User} from "../models/index.js";
import {categories} from "../utils/userDataCategory.js";

const websiteSWOT = asyncWrapper(
    async (req,res,next)=>{
        
        const user = await User.findOne({where: {email: req.user.email}});

        const oldUserData = await UserData.findOne({where: {
            category: categories.WEBSITE_SWOT,
            userId: user.id
        }})

        if(oldUserData){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Only 1 request per service."});
        }

        const {business_description, company_name, country, goal, website_url} = req.body;
      
        if(process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/website-swot-analysis`, {
                business_description,
                company_name,
                country,
                goal,
                website_url
            });
            
            // save data to UserData
            const createdUserData = await UserData.create({
                data: response.data,
                category: categories.WEBSITE_SWOT,
                userId: user.id
            });
            
            return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
        }

        
        // // save data to UserData
        // const createdUserData = await UserData.create({
        //     data: testData.websiteSWOTTestData,
        //     category: categories.WEBSITE_SWOT,
        //     userId: user.id
        // });

        // JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, testData.websiteSWOTTestData);
    }
);

const sentimentAnalysis = asyncWrapper(
    async (req,res,next)=>{

        const user = await User.findOne({where: {email: req.user.email}});

        const oldUserData = await UserData.findOne({where: {
            category: categories.SENTIMENT,
            userId: user.id
        }})

        if(oldUserData){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Only 1 request per service."});
        }

        const {company_name, business_description, goal, country, industry_field} = req.body;
        
        if(process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/customer-sentiment-analysis`, {
              business_description,
              company_name,
              country,
              goal,
              industry_field
            });

            // save data to UserData
            const createdUserData = await UserData.create({
                data: response.data,
                category: categories.SENTIMENT,
                userId: user.id
            });
          
            return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
        }
        

        // // save data to UserData
        // const createdUserData = await UserData.create({
        //     data: testData.sentimentTestData,
        //     category: categories.SENTIMENT,
        //     userId: user.id
        // });

        // JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, testData.sentimentTestData);
    }
);

const socialSWOT = asyncWrapper(
    async (req,res,next)=>{

        const user = await User.findOne({where: {email: req.user.email}});

        const oldUserData = await UserData.findOne({where: {
            category: categories.SOCIAL_SWOT,
            userId: user.id
        }})

        if(oldUserData){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Only 1 request per service."});
        }

        const {business_description, company_name, country, goal, instagram_link} = req.body;  
      
        if(process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/social-swot-analysis`, {
              business_description,
              company_name,
              country,
              goal,
              instagram_link
            });

            // save data to UserData
            const createdUserData = await UserData.create({
                data: response.data,
                category: categories.SOCIAL_SWOT,
                userId: user.id
            });
          
            return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
        }

        // // save data to UserData
        // const createdUserData = await UserData.create({
        //     data: testData.socialSWOTTestData,
        //     category: categories.SOCIAL_SWOT,
        //     userId: user.id
        // });
        
        // JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, testData.socialSWOTTestData);
    }
);

const brandingAudit = asyncWrapper(
    async (req,res,next)=>{

        const user = await User.findOne({where: {email: req.user.email}});

        const oldUserData = await UserData.findOne({where: {
            category: categories.BRAND_AUDIT,
            userId: user.id
        }})

        if(oldUserData){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Only 1 request per service."});
        }

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


            // save data to UserData
            const createdUserData = await UserData.create({
                data: response.data,
                category: categories.BRAND_AUDIT,
                userId: user.id
            });

            return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
        }

        // // save data to UserData
        // const createdUserData = await UserData.create({
        //     data: testData.brandAuditTestData,
        //     category: categories.BRAND_AUDIT,
        //     userId: user.id
        // });
        
        // JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, testData.brandAuditTestData); 
    }
);

const serviceLimitReached = asyncWrapper(
    async (req,res,next)=>{
        
        // get user
        const user = await User.findOne({where: {email: req.user.email}});
        const category = req.body.category;
        const userData = await UserData.findOne({where: {
            userId: user.id,
            category: category
        }})
        

        if(userData){
            JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {reached: true}); 
        }else{
            JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {reached: false}); 
        }
    }
)

export default {
    websiteSWOT,
    sentimentAnalysis,
    socialSWOT,
    brandingAudit,
    serviceLimitReached
}