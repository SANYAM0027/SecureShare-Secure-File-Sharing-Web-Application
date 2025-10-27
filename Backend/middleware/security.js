// middleware/security.js
import helmet from "helmet";
import csurf from "csurf";

/**
 * Apply common security middleware
 */
export const applySecurityMiddleware = (app) => {
  app.use(helmet()); // secure HTTP headers
  app.use(csurf({ cookie: true })); // CSRF protection
};
