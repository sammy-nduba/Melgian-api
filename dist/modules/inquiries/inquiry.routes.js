import { createInquiryController } from "./inquiry.controller.js";
export async function inquiryRoutes(app) {
    app.post("/", createInquiryController);
}
