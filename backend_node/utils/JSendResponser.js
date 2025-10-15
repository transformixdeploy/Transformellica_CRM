import HttpStatusMessage from "./HttpStatusMessage.js";

export default function(res, statusCode, status, data){
    if(status === HttpStatusMessage.ERROR){
        return res.status(statusCode).json({status: status, message: data.message});
    }

    return res.status(statusCode).json({status: status, data});
}