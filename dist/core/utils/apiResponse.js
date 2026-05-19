export function sendSuccess(reply, data, statusCode = 200) {
    return reply.status(statusCode).send({
        success: true,
        data,
    });
}
export function sendError(reply, message, statusCode = 400, details) {
    return reply.status(statusCode).send({
        success: false,
        message,
        details,
    });
}
