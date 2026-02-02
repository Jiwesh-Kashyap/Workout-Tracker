const { validateToken } = require("../services/authn");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        console.log(`[AUTH DEBUG] Checking cookie '${cookieName}':`, tokenCookieValue ? "Found" : "Missing");

        if (!tokenCookieValue) {
            console.log("[AUTH DEBUG] No token cookie, proceeding without auth.");
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            console.log("[AUTH DEBUG] Token validated for user:", userPayload.email);
        } catch (error) {
            console.error("[AUTH DEBUG] Token validation failed:", error.message);
        }

        return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};