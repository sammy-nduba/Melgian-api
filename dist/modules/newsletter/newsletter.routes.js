import { subscribeController } from "./newsletter.controller.js";
/**
 * Registers all public routes under the newsletter module.
 */
export async function newsletterRoutes(app) {
    app.post("/", subscribeController);
}
