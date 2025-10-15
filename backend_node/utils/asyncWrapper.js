import HttpStatusCode from "./HttpStatusCode.js";
import HttpStatusMessage from "./HttpStatusMessage.js";
import JSendResponser from "./JSendResponser.js";

export const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            JSendResponser(res, HttpStatusCode.INTERNAL_SERVER_ERROR, HttpStatusMessage.ERROR, error);
            // next(error); // Passes error to error handling middleware if you want o create seperate middleware to handle errors
        }
    };  
};

// asyncWrapper const is just a higher-order function that takes a function "fn" as its argument
// this "fn" is supposed to be the function that will be executed when user requests its route
// asyncWrapper doesn't execute your "fn" immediately, instead it wraps it inside another function that have the same structure as what express.js route handlers expects
// inside the new created function your "fn" will be surrounded by try-catch blocks, so when it is executed we can catch the errors that may happen