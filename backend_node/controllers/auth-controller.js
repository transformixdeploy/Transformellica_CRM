import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {User} from "../models/index.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import HttpStatusMessage from "../utils/HttpStatusMessage.js";
import JSendResponser from "../utils/JSendResponser.js";
import {asyncWrapper} from "../utils/asyncWrapper.js";

const register = asyncWrapper( 
    async (req,res,next) => {
        
        // check if user already exists
        const user = await User.findOne({where: {email: req.body.email}});
        if(user){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "User already exists."});
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 5);
        
        // Create new user
        const createdUser = await User.create({
            ...req.body,
            password: hashedPassword
        });

        // Create access token
        const accessToken = jwt.sign({
            role: createdUser.role,
            email: createdUser.email,
            fullName: createdUser.fullName
        }, process.env.JWT_SECRET_KEY, {expiresIn: "15m"});
        
        // Create refresh token
        const refreshToken = jwt.sign({
            role: createdUser.role,
            email: createdUser.email,
            fullName: createdUser.fullName
        }, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

        // set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
            sameSite: 'Strict',      // prevents CSRF
        });

        // return access token
        JSendResponser(res, HttpStatusCode.CREATED, HttpStatusMessage.SUCCESS, {accessToken});
    }
)

const login = asyncWrapper(
    async (req,res,next) => {
    
        // check if user exists
        const user = await User.findOne({where: {email: req.body.email}});
        if(!user){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "User doesn't exist."});
        }
    
        // check correct password
        const passwordMatch = await bcrypt.compare(req.body.password, user.dataValues.password);
        if(!passwordMatch){
            return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "Incorrect password."});
        }
    
        // Create access token
        const accessToken = jwt.sign({
            role: user.role,
            email: user.email,
            fullName: user.fullName
        }, process.env.JWT_SECRET_KEY, {expiresIn: "15m"});
        
        // Create refresh token
        const refreshToken = jwt.sign({
            role: user.role,
            email: user.email,
            fullName: user.fullName
        }, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
    
        // set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
            sameSite: 'Strict',      // prevents CSRF
        });
    
        // return access token
        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {accessToken});
    }
)

const refresh = asyncWrapper(
    async (req,res,next) => {
        const refreshToken = req.cookies.refreshToken;

        try {
        
            // Check if refresh token is still valid
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

            // Create new access token
            const accessToken = jwt.sign({
                role : decoded.role,
                fullName: decoded.fullName,
                email: decoded.email
            }, process.env.JWT_SECRET_KEY, {expiresIn: "15m"});

            JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, {accessToken});
        } catch (error) {
            return JSendResponser(res, HttpStatusCode.FORBIDDEN, HttpStatusMessage.FAIL, {message: "Refresh token expired, login required."});
        }
    }
)

const logout = asyncWrapper(
    async (req,res,next)=>{
        res.clearCookie("refreshToken");
        JSendResponser(res, HttpStatusCode.OK, HttpStatusMessage.SUCCESS, null);
    }
)

export default {
    register,
    login,
    refresh,
    logout
}