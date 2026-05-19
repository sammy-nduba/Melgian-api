import { getTourBySlugController, getToursController, } from "./tour.controller.js";
export async function tourRoutes(app) {
    app.get("/", getToursController);
    app.get("/:slug", getTourBySlugController);
}
