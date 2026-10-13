import { StatusCodes } from "http-status-codes";

const notFoundRoute = (req,res)=>res.status(StatusCodes.NOT_FOUND).send("Routes not found");


export default notFoundRoute;