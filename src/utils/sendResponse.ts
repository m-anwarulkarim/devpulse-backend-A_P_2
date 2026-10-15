import { Response } from "express";

interface IResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>(res: Response, responseData: IResponseData<T>): void => {
  res.status(responseData.statusCode).json({
    success: responseData.success,
    message: responseData.message,
    ...(responseData.data !== undefined && { data: responseData.data }),
  });
};
