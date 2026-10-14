import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-api.error.js";

class UnauthorizeError extends CustomApiError{
    constructor(message){
        super(message);
        this.statusCode= StatusCodes.FORBIDDEN;
    }
}

export default UnauthorizeError;