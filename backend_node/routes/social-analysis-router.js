import express from "express";
import socialAnalysisController from "../controllers/social-analysis-controller.js";
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const router = express.Router();

router.route("/website-swot")
    .post(socialAnalysisController.createWebsiteSWOT);

router.route("/store/website-swot")
    .post(socialAnalysisController.storeWebsiteAnalysis);

router.route("/sentiment-analysis")
    .post(socialAnalysisController.createSentimentAnalysis);

router.route("/store/sentiment-analysis")
    .post(socialAnalysisController.storeSentimentAnalysis);

router.route("/instagram-analysis")
    .post(socialAnalysisController.createInstagramAnalysis);

router.route("/store/instagram-analysis")
    .post(socialAnalysisController.storeInstagramAnalysis);

router.route("/tiktok-analysis")
    .post(socialAnalysisController.createTikTokAnalysis);

router.route("/store/tiktok-analysis")
    .post(socialAnalysisController.storeTiktokAnalysis);

router.route("/branding-audit")
    .post(upload.single("logoUpload") , socialAnalysisController.createBrandingAudit);

router.route("/store/branding-audit")
    .post(socialAnalysisController.storeBrandAuditAnalysis);



router.route("/userData/:id")
    .get(socialAnalysisController.getUserData)
    .delete(socialAnalysisController.deleteUserData);

router.route("/userData/history/:category")
    .get(socialAnalysisController.getUserHistoryObjects);

router.route("/serviceLimitReached")
    .post(socialAnalysisController.serviceLimitReached);


export default router;