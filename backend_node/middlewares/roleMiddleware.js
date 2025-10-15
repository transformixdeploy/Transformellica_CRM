import JSendResponser from "../utils/JSendResponser.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import HttpStatusMessage from "../utils/HttpStatusMessage.js";

export default (requiredRole) => ( (req,res,next) => {
        
            if(!req.user){
                return JSendResponser(res, HttpStatusCode.UNAUTHORIZED, HttpStatusMessage.FAIL, {message: "User not authenticated."});
            }
    
            if (req.user.role !== requiredRole) {
                return JSendResponser(res, HttpStatusCode.FORBIDDEN, HttpStatusMessage.FAIL, {message: `Only ${requiredRole} can access this endpoint.`});
            }
    
            next();
        }
    )