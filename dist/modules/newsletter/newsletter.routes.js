import { prisma } from "@/core/db/prisma.js";
import { newsletterSchema } from "@/core/validation/newsletter.schema.js";
import { sendError, sendSuccess } from "@/core/utils/apiResponse.js";
export async function newsletterRoutes(app) {
    app.post("/", async (request, reply) => {
        try {
            const parsed = newsletterSchema.safeParse(request.body);
            if (!parsed.success) {
                return sendError(reply, "Invalid newsletter data.", 422, parsed.error.flatten());
            }
            const subscriber = await prisma.newsletterSubscriber.upsert({
                where: {
                    email: parsed.data.email,
                },
                update: {
                    isActive: true,
                    source: parsed.data.source,
                },
                create: {
                    email: parsed.data.email,
                    source: parsed.data.source,
                },
                select: {
                    id: true,
                    email: true,
                    isActive: true,
                },
            });
            return sendSuccess(reply, {
                message: "Subscribed successfully.",
                subscriber,
            }, 201);
        }
        catch (error) {
            request.log.error(error);
            return sendError(reply, "Unable to subscribe.", 500);
        }
    });
}
