export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "something went wrong";
  }

  return message;
};

// custom errors for server

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_SERVER_ERROR",
    details?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class CompilerError extends Error{
  public statusCode: number;
  public code: string;
  public data?: Object;

  constructor(
    message: string,
    statusCode: number = 400,
    code: string = "COMPILER_ERROR",
    data?: Object
  ){
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.data = data
  }
}
