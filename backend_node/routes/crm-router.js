import express from "express";
import multer from 'multer';
import crmController from "../controllers/crm-controller.js";

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const router = express.Router();

router.route("/pattern-analysis")
    .get(crmController.checkForPatterns)
    .post(crmController.analysePatterns);

router.route("/table")
    .get(crmController.checkTableExistance)
    .delete(crmController.deleteTable);

router.route("/dashboard")
    .get(crmController.getDashboardData);

router.route("/display-cards")
    .get(crmController.dashboardDisplayCards);

router.route("/data")
    .get(crmController.getData)
    .post(upload.single('data'), crmController.uploadData);

router.route("/smart-question")
    .get(crmController.getSmartQuestions)
    .post(crmController.answerQuestion);

export default router;