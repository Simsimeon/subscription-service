import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-api.error.js";

class NotFoundApiError extends CustomApiError{
    constructor(message){
        super(message);
        this.statusCode= StatusCodes.NOT_FOUND;
    }
}

export default NotFoundApiError;