import jwt from "jsonwebtoken"
import JSendResponser from "../utils/JSendResponser.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import HttpStatusMessage from "../utils/HttpStatusMessage.js";

export default (req,res,next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return JSendResponser(res, HttpStatusCode.BAD_REQUEST, HttpStatusMessage.FAIL, {message: "No token provided."});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // put payload in the request
        next();
    } catch (error) {
        return JSendResponser(res, HttpStatusCode.FORBIDDEN, HttpStatusMessage.FAIL, {message: "Invalid or expired token."});
    }

}