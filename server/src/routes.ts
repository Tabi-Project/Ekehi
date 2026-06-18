import { Router } from "express";

import { authLimiter, generalLimiter } from "#/middleware/rate-limit";
import { adminRouter } from "#/modules/admin/admin.routes";
import { authRouter } from "#/modules/auth/auth.routes";
import { guidesRouter } from "#/modules/guides/guides.routes";
import { healthRouter } from "#/modules/health/health.routes";
import { metaRouter } from "#/modules/meta/meta.routes";
import { opportunitiesRouter } from "#/modules/opportunities/opportunities.routes";
import { profileRouter } from "#/modules/profile/profile.routes";
import { templatesRouter } from "#/modules/templates/templates.routes";
import { trainingsRouter } from "#/modules/trainings/trainings.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/opportunities", opportunitiesRouter);
apiRouter.use("/trainings", trainingsRouter);
apiRouter.use("/guides", guidesRouter);
apiRouter.use("/templates", templatesRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/meta", metaRouter);

export const routes = Router();

// Health is registered before the rate limiters so uptime monitors are never
// throttled.
routes.use("/api/v1/health", healthRouter);

// Rate limiters: strict on auth, general on everything else under /api/v1.
routes.use("/api/v1/auth", authLimiter);
routes.use("/api/v1", generalLimiter);

routes.use("/api/v1", apiRouter);
