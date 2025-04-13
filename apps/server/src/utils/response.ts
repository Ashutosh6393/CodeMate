
export const successResponse = (message: string, data?: string | object) => ({
    success: true,
    message,
    data,
});

export const errorResponse = (message: string | object) => ({
    success: false,
    message,
});