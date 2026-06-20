const { Router } = require("express");
const { getQueue, getContentItem, reviewContent, getReviewHistory, getMySubmissions, deleteContent } = require("../controllers/admin.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/requireRole.middleware");

const router = Router();

const adminGuard = [requireAuth, requireRole("super-admin", "data-manager", "content-editor")];

router.get("/queue", ...adminGuard, getQueue);
router.get("/my-submissions", ...adminGuard, getMySubmissions);
router.get("/:contentType/:id", ...adminGuard, getContentItem);
router.patch("/:contentType/:id/review", ...adminGuard, reviewContent);
router.get("/:contentType/:id/reviews", ...adminGuard, getReviewHistory);
router.delete("/:contentType/:id", ...adminGuard, deleteContent);

module.exports = router;
