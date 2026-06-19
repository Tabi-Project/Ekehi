import { createApp } from "#/app";
import { env } from "#/config/env";
import { logger } from "#/lib/logger";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(
    `Ekehi server running on port ${env.PORT} in ${env.NODE_ENV} mode`,
  );
});
