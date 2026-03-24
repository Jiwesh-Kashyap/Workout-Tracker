const { validateToken } = require("../services/authn");
const isProduction = process.env.NODE_ENV === 'production';

function checkForAuthenticationCookie() {
    return (req, res, next) => {
        // Fallback to cookie for backwards compatibility 
        let tokenCookieValue = req.cookies && req.cookies["token"];
        
        // Priority to Authorization Header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            tokenCookieValue = authHeader.split(' ')[1];
        }

        console.log(`[AUTH DEBUG] Checking authentication token:`, tokenCookieValue ? "Found" : "Missing");

        if (!tokenCookieValue) {
            console.log("[AUTH DEBUG] No token found, proceeding without auth.");
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            console.log("[AUTH DEBUG] Token validated for user:", userPayload.email);
        } catch (error) {
            console.error("[AUTH DEBUG] Token validation failed:", error.message);
            res.clearCookie("token", {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                path: '/'
            });
        }

        return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};