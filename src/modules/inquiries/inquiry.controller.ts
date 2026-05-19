import { FastifyReply, FastifyRequest } from "fastify";
import { createInquirySchema } from "@/core/validation/inquiry.schema.js";
import { sendError, sendSuccess } from "@/core/utils/apiResponse.js";
import { InquiryService } from "./inquiry.service.js";

export async function createInquiryController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parsed = createInquirySchema.safeParse(request.body);

    if (!parsed.success) {
      return sendError(
        reply,
        "Invalid inquiry data.",
        422,
        parsed.error.flatten()
      );
    }

    const inquiryService = new InquiryService();
    const inquiry = await inquiryService.submitInquiry(parsed.data);

    return sendSuccess(
      reply,
      {
        message: "Inquiry submitted successfully.",
        inquiry,
      },
      201
    );
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Unable to submit inquiry.", 500);
  }
}
