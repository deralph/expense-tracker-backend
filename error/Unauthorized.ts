import { StatusCodes } from "http-status-codes"
import customError from "./customError"

class Unauthorized extends customError {
  public status: number;
  public message: string;
  constructor(message: string, status?: number) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
    this.message = message;
  }

  //   constructor(message: string, statusCode: Number = StatusCodes.BAD_REQUEST) {
  //     super(message);
  //   }
}

export default Unauthorized;
