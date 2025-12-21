import rateLimit from "express-rate-limit";
const RateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: {
        error: "Too many requests. Try again later.",
        retryAfter: 15 * 60,
    },
});
export default RateLimiter;
//# sourceMappingURL=rateLimit.util.js.map