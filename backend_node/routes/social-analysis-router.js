import express from "express";
import socialAnalysisController from "../controllers/social-analysis-controller.js";
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const router = express.Router();

router.route("/website-swot")
    .post(socialAnalysisController.createWebsiteSWOT);

router.route("/sentiment-analysis")
    .post(socialAnalysisController.createSentimentAnalysis);

router.route("/social-swot")
    .post(socialAnalysisController.createSocialSWOT);

router.route("/branding-audit")
    .post(upload.single("logoUpload") , socialAnalysisController.createBrandingAudit);

router.route("/userData/:id")
    .get(socialAnalysisController.getUserData)
    .delete(socialAnalysisController.deleteUserData);

router.route("/userData/history/:category")
    .get(socialAnalysisController.getUserHistoryObjects);

router.route("/serviceLimitReached")
    .post(socialAnalysisController.serviceLimitReached);


export default router;