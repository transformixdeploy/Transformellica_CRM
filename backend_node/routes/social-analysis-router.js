import express from "express";
import socialAnalysisController from "../controllers/social-analysis-controller.js";
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const router = express.Router();

router.route("/website-swot")
    .post(socialAnalysisController.websiteSWOT);

router.route("/sentiment-analysis")
    .post(socialAnalysisController.sentimentAnalysis);

router.route("/social-swot")
    .post(socialAnalysisController.socialSWOT);

router.route("/branding-audit")
    .post(upload.single("logoUpload") , socialAnalysisController.brandingAudit);

router.route("/serviceLimitReached")
    .post(socialAnalysisController.serviceLimitReached);


export default router;