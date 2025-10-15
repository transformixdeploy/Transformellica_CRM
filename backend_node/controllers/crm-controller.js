import helperFunctions from "../utils/HelperFunctions.js";
import { neon } from '@neondatabase/serverless';
import axios from "axios";
import FormData from 'form-data';
import csv from "csvtojson";
import JSendResponser from "../utils/JSendResponser.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import HttpStatusMessage from "../utils/HttpStatusMessage.js";
import { v2 as cloudinary } from 'cloudinary';
import { asyncWrapper } from "../utils/asyncWrapper.js";

const getDbClient = () => neon(process.env.DATABASE_URL);

const getDashboardData = asyncWrapper(
  async (req, res, next)=>{
    const sql = getDbClient();
    
    const uploadedFile = await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv';`;
  
    const csvDataBuffer = await axios.get(uploadedFile[0].secureUrl, { responseType: 'arraybuffer' });
    const formData = new FormData();
    formData.append('data', Buffer.from(csvDataBuffer.data), { filename: uploadedFile[0].originalFilename, contentType: 'text/csv' });
  
    const response = await axios.post(
      `${process.env.AI_SERVICE_CRM_URL}/dashboard-data`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
  
    JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
  }
);

const checkForPatterns = asyncWrapper(
  async (req, res, next)=>{
    const sql = getDbClient();
    
    const uploadedFile = await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv';`;
  
    const csvDataBuffer = await axios.get(uploadedFile[0].secureUrl, { responseType: 'arraybuffer' });
    const formData = new FormData();
    formData.append('data', Buffer.from(csvDataBuffer.data), { filename: uploadedFile[0].originalFilename, contentType: 'text/csv' });
  
    const response = await axios.post(
      `${process.env.AI_SERVICE_CRM_URL}/pattern-analysis-initial`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
  
    console.log(response.data);
    
  
    JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
  }
);

const analysePatterns = asyncWrapper(
  async (req, res, next)=>{
    const sql = getDbClient();
    
    const uploadedFile = await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv';`;
  
    const csvDataBuffer = await axios.get(uploadedFile[0].secureUrl, { responseType: 'arraybuffer' });
    const formData = new FormData();
    formData.append('data', Buffer.from(csvDataBuffer.data), { filename: uploadedFile[0].originalFilename, contentType: 'text/csv' });
  
    formData.append("min_support", req.body.minSupport);
  
    const response = await axios.post(
      `${process.env.AI_SERVICE_CRM_URL}/pattern-analysis-analyze`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
  
    JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
  }
);

const getSmartQuestions = asyncWrapper(
  async (req, res, next)=>{
    const sql = getDbClient();
    
    const uploadedFile = await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv';`;
  
    const csvDataBuffer = await axios.get(uploadedFile[0].secureUrl, { responseType: 'arraybuffer' });
    const formData = new FormData();
    formData.append('data', Buffer.from(csvDataBuffer.data), { filename: uploadedFile[0].originalFilename, contentType: 'text/csv' });
  
    const response = await axios.post(
      `${process.env.AI_SERVICE_CRM_URL}/smart-question-examples`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
  
    JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
  }
);

const answerQuestion = asyncWrapper(
  async (req, res, next)=>{
    const sql = getDbClient();
    
    const uploadedFile = await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv';`;
  
    const csvDataBuffer = await axios.get(uploadedFile[0].secureUrl, { responseType: 'arraybuffer' });
    const formData = new FormData();
  
  
    formData.append('data', Buffer.from(csvDataBuffer.data), { filename: uploadedFile[0].originalFilename, contentType: 'text/csv' });
    formData.append('question', req.body.question);
  
    const response = await axios.post(
      `${process.env.AI_SERVICE_CRM_URL}/question-answer`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
  
    JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
  }
);

const deleteTable = asyncWrapper(
  async (req, res, next)=>{
    const sql = getDbClient();
  
    // 1. Delete the "data" table from the database
    await sql`DROP TABLE IF EXISTS "data";`;
  
    // 2. Delete the uploaded file metadata from PostgreSQL and optionally from Cloudinary
    const uploadedFile = await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv';`;
    if (uploadedFile.length > 0) {
      // Delete from Cloudinary
      await sql`DELETE FROM "UploadedFile" WHERE "publicId" = 'data.csv';`; 
      await cloudinary.uploader.destroy(uploadedFile[0].publicId);
    }

    JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, null);
  }
);

const dashboardDisplayCards = asyncWrapper(
  async (req, res, next)=>{
    const sql = getDbClient();
    
    const uploadedFile = await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv';`;
  
      if (uploadedFile.length == 0) {
        return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {
          "domain": "No data uploaded",
          "missing_data_ratio": 0,
          "num_numeric_columns": 0,
          "total_columns": 0,
          "total_rows": 0
        });
      }
  
      const csvDataBuffer = await axios.get(uploadedFile[0].secureUrl, { responseType: 'arraybuffer' });
      const formData = new FormData();
      formData.append('data', Buffer.from(csvDataBuffer.data), { filename: uploadedFile[0].originalFilename, contentType: 'text/csv' });
  
    const response = await axios.post(
      `${process.env.AI_SERVICE_CRM_URL}/upload`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    
    JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, response.data);
  }
);

const checkTableExistance = asyncWrapper(
  async (req, res, next)=>{
    const sql = getDbClient();
    
    const uploadedFile = await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv';`;
    if (uploadedFile.length > 0) {
      return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {status: true})
    } else {
      return JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {status: false})
    }
  }
);

const getData = asyncWrapper(
  async (req, res, next) => {
    const sql = getDbClient();
  
    console.log('Starting /api/data', { query: req.query });

    // Check if data table exists
    console.log('Query 0: Checking if data table exists');
    const dataTable = await sql`SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'data'
    )`;
    console.log('Query 0 result:', dataTable);

    if (!dataTable[0].exists) {
      console.log('No data table found');
      return JSendResponser(res, HttpStatusCode.NOT_FOUND, HttpStatusMessage.FAIL, {message: "Data table not found. Please upload a CSV first."});
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    console.log('Pagination params:', { page, limit, offset });

    // Fetch paginated data
    console.log('Calling generatePaginatedDataQuery');
    const { count, rows } = await helperFunctions.generatePaginatedDataQuery(sql, "data", offset, limit);
    console.log('generatePaginatedDataQuery result:', { count, rows });

    const lastPage = Math.ceil(count / limit);
    console.log('Response data:', { lastPage, totalCount: count, rowsLength: rows.length });

    JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, { rows, lastPage, totalCount: count });
  }
);

const uploadData = asyncWrapper(
  async (req, res, next) => {
    const sql = getDbClient();
  
    console.log('Starting /api/upload');
  
    // Check if file uploaded
    if (!req.file) {
      console.log('No file uploaded');
      return JSendResponser(res, HttpStatusCode.NOT_FOUND, HttpStatusMessage.FAIL, { message: 'No CSV file uploaded' });
    }
    console.log('File received:', req.file.originalname, req.file.mimetype);
  
    // Check existing file
    console.log('Query 1: Checking for existing file in UploadedFile');
    const existingFile = await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv'`;
    console.log('Query 1 result:', existingFile);
  
    if (existingFile.length > 0) {
      console.log('Query 2: Checking if data table exists');
      const dataTable = await sql`SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'data'
      )`;
      console.log('Query 2 result:', dataTable);
  
      if (dataTable[0].exists) {
        console.log('Query 3: Dropping data table');
        await sql`DROP TABLE IF EXISTS "data"`;
        console.log('Query 3 completed');
      }
  
      console.log('Query 4: Deleting from Cloudinary:', existingFile[0].publicId);
      await cloudinary.uploader.destroy(existingFile[0].publicId);
      console.log('Query 4: Deleting from UploadedFile');
      await sql`DELETE FROM "UploadedFile" WHERE "publicId" = 'data.csv'`;
      console.log('Query 4 completed');
    }
  
    // Upload to Cloudinary
    console.log('Uploading to Cloudinary');
    const cloudinaryUploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        resource_type: 'raw',
        public_id: 'data.csv',
        format: 'csv',
      }
    );
    console.log('Cloudinary upload result:', cloudinaryUploadResult);
  
    // Insert into UploadedFile
    console.log('Query 5: Inserting into UploadedFile');
    await sql`INSERT INTO "UploadedFile" ("publicId", "secureUrl", "originalFilename", "createdAt", "updatedAt")
      VALUES (${cloudinaryUploadResult.public_id}, ${cloudinaryUploadResult.secure_url}, ${req.file.originalname}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    console.log('Query 5 completed');
  
    const newUploadedFile = (await sql`SELECT * FROM "UploadedFile" WHERE "publicId" = 'data.csv'`)[0];
    console.log('Query 6: Fetched new uploaded file:', newUploadedFile);
  
    // Parse CSV
    console.log('Parsing CSV');
    const userData = await csv({ checkType: true }).fromString(req.file.buffer.toString());
    console.log('CSV parsed, rows:', userData.length);
  
    // Send to AI service
    console.log('Fetching CSV from Cloudinary for AI service');
    const csvDataBuffer = await axios.get(newUploadedFile.secureUrl, { responseType: 'arraybuffer' });
    const formData = new FormData();
    formData.append('data', Buffer.from(csvDataBuffer.data), { filename: newUploadedFile.originalFilename, contentType: req.file.mimetype });
    console.log('Sending to AI service:', process.env.AI_SERVICE_CRM_URL);
    const response = await axios.post(
      `${process.env.AI_SERVICE_CRM_URL}/upload`,
      formData,
      { headers: formData.getHeaders() }
    );
    console.log('AI service response:', response.data);
  
    // Create table
    console.log('Query 7: Generating and executing CREATE TABLE');
    const createTableSql = helperFunctions.generateDynamicCreateTableSql("data", userData, helperFunctions.inferSqlType);
    console.log('Generated CREATE TABLE SQL:', createTableSql);
    await sql.query(createTableSql);
    console.log('Query 7 completed');
  
    // Insert data
    console.log('Query 8: Generating and executing INSERT');
    const insertSql = helperFunctions.generateDynamicInsertSql("data", userData);
    console.log('Generated INSERT SQL:', insertSql);
    await sql.query(insertSql);
    console.log('Query 8 completed');
  
    console.log('Upload completed successfully');
    JSendResponser(res, HttpStatusCode.CREATED, HttpStatusMessage.SUCCESS, response.data);
  }
);

export default {
  getDashboardData,
  checkForPatterns,
  analysePatterns,
  getSmartQuestions,
  answerQuestion,
  deleteTable,
  dashboardDisplayCards,
  checkTableExistance,
  getData,
  uploadData
}
