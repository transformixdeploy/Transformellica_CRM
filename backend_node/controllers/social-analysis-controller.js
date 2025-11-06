import axios from 'axios';
import testData from '../utils/TestData.js';
import JSendResponser from '../utils/JSendResponser.js';
import HttpStatusCode from '../utils/HttpStatusCode.js';
import HttpStatusMessage from '../utils/HttpStatusMessage.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import {UserData, User} from "../models/index.js";
import {categories} from "../utils/userDataCategory.js";
import { roles } from '../utils/userRoles.js';

const createWebsiteSWOT = asyncWrapper(
    async (req,res,next)=>{
        
        const user = await User.findOne({where: {email: req.user.email}});

        const limiteReached = await serviceLimitReachedHelperFunction(user.role, user.id, categories.WEBSITE_SWOT);

        if(limiteReached){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Limit Reached for this service"});
        }

        console.log("Website SWOT: User is verified");

        const {business_description, company_name, country, goal, website_url} = req.body;

        if(!process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            // // save data to UserData
            // const createdUserData = await UserData.create({
            //     title: `${country} - ${brandName} - {${new Date().toLocaleString()}}`,
            //     data: testData.socialSWOTTestData,
            //     category: categories.SOCIAL_SWOT,
            //     userId: user.id
            // });
            
            // return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {id:createdUserData.dataValues.id});
            return;
        }

        // Set SSE headers for streaming chunks
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Important for Node.js to start sending

        //social-swot-analysis
        const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/website-swot-analysis`, {
            business_description,
            company_name,
            country,
            goal,
            website_url
        }, {
            responseType: "stream"
        });
        
        response.data.pipe(res);
    }
);

const createSentimentAnalysis = asyncWrapper(
    async (req,res,next)=>{

        const user = await User.findOne({where: {email: req.user.email}});

        const limiteReached = await serviceLimitReachedHelperFunction(user.role, user.id, categories.SENTIMENT);

        if(limiteReached){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Limit Reached for this service"});
        }

        
        const {company_name, business_description, goal, country, industry_field} = req.body;

        if(!process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            // // save data to UserData
            // const createdUserData = await UserData.create({
            //     title: `${country} - ${brandName} - {${new Date().toLocaleString()}}`,
            //     data: testData.socialSWOTTestData,
            //     category: categories.SOCIAL_SWOT,
            //     userId: user.id
            // });
            
            // return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {id:createdUserData.dataValues.id});
            return;
        }

        // Set SSE headers for streaming chunks
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Important for Node.js to start sending

        //social-swot-analysis
        const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/customer-sentiment-analysis`, {
            business_description,
            company_name,
            country,
            goal,
            industry_field
        }, {
            responseType: "stream"
        });
        
        response.data.pipe(res);
    }
);

const createInstagramAnalysis = asyncWrapper(
    async (req,res,next)=>{

        const user = await User.findOne({where: {email: req.user.email}});

        const limiteReached = await serviceLimitReachedHelperFunction(user.role, user.id, categories.SOCIAL_SWOT);

        if(limiteReached){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Limit Reached for this service"});
        }

        const {business_description, company_name, country, goal, instagram_link} = req.body;
      
        if(!process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            // // save data to UserData
            // const createdUserData = await UserData.create({
            //     title: `${country} - ${brandName} - {${new Date().toLocaleString()}}`,
            //     data: testData.socialSWOTTestData,
            //     category: categories.SOCIAL_SWOT,
            //     userId: user.id
            // });
            
            // return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {id:createdUserData.dataValues.id});
            return;
        }

        // Set SSE headers for streaming chunks
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Important for Node.js to start sending

        //social-swot-analysis
        const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/social-swot-analysis`, {
          business_description,
          company_name,
          country,
          goal,
          instagram_link
        }, {
            responseType: "stream"
        });
        
        response.data.pipe(res);
    }
);

const createTikTokAnalysis = asyncWrapper(
    async (req,res,next)=>{

        const user = await User.findOne({where: {email: req.user.email}});

        const limiteReached = await serviceLimitReachedHelperFunction(user.role, user.id, categories.SOCIAL_SWOT);

        if(limiteReached){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Limit Reached for this service"});
        }

        const {business_description, company_name, country, goal, tiktok_link} = req.body;  
        
        if(!process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            // // save data to UserData
            // const createdUserData = await UserData.create({
            //     title: `${country} - ${brandName} - {${new Date().toLocaleString()}}`,
            //     data: testData.socialSWOTTestData,
            //     category: categories.SOCIAL_SWOT,
            //     userId: user.id
            // });
            
            // return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {id:createdUserData.dataValues.id});
            return;
        }

        // Set SSE headers for streaming chunks
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Important for Node.js to start sending

        //social-swot-analysis
        const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/social-analysis-tiktok`, {
            business_description,
            company_name,
            country,
            goal,
            tiktok_link
        }, {
            responseType: "stream"
        });
        
        response.data.pipe(res);

    }
);

const createBrandingAudit = asyncWrapper(
    async (req,res,next)=>{

        const user = await User.findOne({where: {email: req.user.email}});

        const limiteReached = await serviceLimitReachedHelperFunction(user.role, user.id, categories.BRAND_AUDIT);

        if(limiteReached){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Limit Reached for this service"});
        }

        const logoUpload = req.file;
        const {business_description, company_name, country, goal, website_url, instagram_link} = req.body;
    
        const file = new File([logoUpload.buffer], logoUpload.originalname, {
            type: logoUpload.mimetype,
        })
        
        const formData = new FormData();
        formData.append("logoUpload" , file);
        formData.append("business_description" , business_description);
        formData.append("company_name" , company_name);
        formData.append("country" , country);
        formData.append("goal" , goal);
        formData.append("website_url" , website_url);
        formData.append("instagram_link" , instagram_link);

        if(!process.env.AI_SERVICE_TRANSFORMELLICA_URL){
            // // save data to UserData
            // const createdUserData = await UserData.create({
            //     title: `${country} - ${brandName} - {${new Date().toLocaleString()}}`,
            //     data: testData.socialSWOTTestData,
            //     category: categories.SOCIAL_SWOT,
            //     userId: user.id
            // });
            
            // return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {id:createdUserData.dataValues.id});
            return;
        }

        // Set SSE headers for streaming chunks
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Important for Node.js to start sending

        //social-swot-analysis
        const response = await axios.post(`${process.env.AI_SERVICE_TRANSFORMELLICA_URL}/branding-audit`, formData , {
            responseType: "stream"
        });
        
        response.data.pipe(res);
    }
);

const storeInstagramAnalysis = asyncWrapper(
    async (req,res,next)=>{

        const {country, instagram_link, dataId, data, userEmail} = req.body;  
        const brandName = instagram_link.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?#]+)(?:[/?#]|$)/i)[1];

        console.log("Instgram Link: ", instagram_link);
        console.log("Brand name: ", brandName);

        const user = await User.findOne({where: {email: userEmail}});
        
        await UserData.create({
            id: dataId,
            title: `${country} - ${brandName} - ${new Date().toLocaleString()}`,
            data: data,
            category: categories.SOCIAL_SWOT,
            userId: user.dataValues.id
        });

        console.log("Data stored successfully.");

        JSendResponser(res, HttpStatusCode.CREATED, HttpStatusMessage.SUCCESS, {message: "Created"});
    }
);

const storeTiktokAnalysis = asyncWrapper(
    async (req,res,next)=>{

        const {country, tiktok_link, dataId, data, userEmail} = req.body;  
        const brandName = tiktok_link.match(/(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([^/?#]+)/i)[1];

        console.log("Tiktok Link: ", tiktok_link);
        console.log("Brand name: ", brandName);

        const user = await User.findOne({where: {email: userEmail}});
        
        await UserData.create({
            id: dataId,
            title: `${country} - ${brandName} - ${new Date().toLocaleString()}`,
            data: data,
            category: categories.SOCIAL_SWOT,
            userId: user.dataValues.id
        });

        console.log("Data stored successfully.");

        JSendResponser(res, HttpStatusCode.CREATED, HttpStatusMessage.SUCCESS, {message: "Created"});
    }
);

const storeWebsiteAnalysis = asyncWrapper(
    async (req,res,next)=>{

        const {country, website_url, dataId, data, userEmail} = req.body;  
        
        const brandName = website_url.match(/^(?:https?:\/\/)?(?:www\.)?(?:[\w-]+\.)*([\w-]+)\.\w+(?:\/|$)/i)[1];

        console.log("Website Link: ", website_url);
        console.log("Brand name: ", brandName);

        const user = await User.findOne({where: {email: userEmail}});
        
        await UserData.create({
            id: dataId,
            title: `${country} - ${brandName} - ${new Date().toLocaleString()}`,
            data: data,
            category: categories.WEBSITE_SWOT,
            userId: user.dataValues.id
        });

        console.log("Data stored successfully.");

        JSendResponser(res, HttpStatusCode.CREATED, HttpStatusMessage.SUCCESS, {message: "Created"});
    }
);

const storeSentimentAnalysis = asyncWrapper(
    async (req,res,next)=>{

        const {country, industry_field, dataId, data, userEmail} = req.body;  

        const user = await User.findOne({where: {email: userEmail}});
        
        await UserData.create({
            id: dataId,
            title: `${country} - ${industry_field} - ${new Date().toLocaleString()}`,
            data: data,
            category: categories.SENTIMENT,
            userId: user.dataValues.id
        });

        console.log("Data stored successfully.");

        JSendResponser(res, HttpStatusCode.CREATED, HttpStatusMessage.SUCCESS, {message: "Created"});
    }
);

const storeBrandAuditAnalysis = asyncWrapper(
    async (req,res,next)=>{

        const {country, dataId, data, userEmail, logoUploadOriginalName} = req.body;

        const user = await User.findOne({where: {email: userEmail}});
        
        await UserData.create({
            id: dataId,
            title: `${country} - ${logoUploadOriginalName} - ${new Date().toLocaleString()}`,
            data: data,
            category: categories.BRAND_AUDIT,
            userId: user.dataValues.id
        });

        console.log("Data stored successfully.");

        JSendResponser(res, HttpStatusCode.CREATED, HttpStatusMessage.SUCCESS, {message: "Created"});
    }
);



const serviceLimitReached = asyncWrapper(
    async (req,res,next)=>{
        
        // get user
        const user = await User.findOne({where: {email: req.user.email}});
        const category = req.body.category;
        
        const limiteReached = await serviceLimitReachedHelperFunction(user.role, user.id, category);

        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {reached: limiteReached}); 
    }
);

const serviceLimitReachedHelperFunction = async (userRole, userId, category)=>{

    const {rows, count} = await UserData.findAndCountAll({where: {userId,category}});

    if(userRole === roles.ADMIN){
        return false; 
    }

    if(count >= Number(process.env.FREE_USER_DIGITAL_ANALYSIS_LIMIT)){
        return true; 
    }else{
        return false; 
    }
};

const getUserHistoryObjects = asyncWrapper(
    async(req,res,next)=>{

        const user = await User.findOne({where: {email: req.user.email}});
        const category = req.params.category;

        const userDataArray = await UserData.findAll({
            where: {
                userId: user.id,
                category: category
            },
            order: [
                ["createdAt", "DESC"],
                ["title", "ASC"],
            ]
        })

        var categoryUrl;
        if(category === categories.WEBSITE_SWOT){
            categoryUrl = "website-swot";
        }else if(category === categories.BRAND_AUDIT){
            categoryUrl = "branding-audit";
        }else if(category === categories.SOCIAL_SWOT){
            categoryUrl = "social-swot";
        }else{
            categoryUrl = "customer-sentiment";
        }

        const userDataObjects = []
        userDataArray.forEach(userData => {
            userDataObjects.push({title: userData.dataValues.title, id: userData.dataValues.id, categoryUrl: categoryUrl});
        });
        

        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {userHistoryDataObjects: userDataObjects});
    }
);

const getUserData = asyncWrapper(
    async (req,res,next)=>{
        const userDataId = req.params.id;
        const data = await UserData.findOne({
            where: {
                id: userDataId
            }
        })
        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, data ? data.dataValues.data : null);
    }
);

const deleteUserData = asyncWrapper(
    async (req,res,next)=>{
        const userDataId = req.params.id;
        await UserData.destroy({
            where: {
                id: userDataId
            }
        })
        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {message: "User data deleted."});
    }
);

export default {
    getUserData,
    deleteUserData,
    getUserHistoryObjects,
    serviceLimitReached,
    createBrandingAudit,
    createWebsiteSWOT,
    createSentimentAnalysis,
    createTikTokAnalysis,
    createInstagramAnalysis,
    storeInstagramAnalysis,
    storeTiktokAnalysis,
    storeWebsiteAnalysis,
    storeSentimentAnalysis,
    storeBrandAuditAnalysis
    
}