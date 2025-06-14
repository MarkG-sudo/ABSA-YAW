// middleware/roleCheck.js
export const requireRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.auth.role)) {
        return res.status(403).json({ message: 'Forbidden: Role Based Access' });
    }
    next();
};
  