<<<<<<< HEAD
module.exports = (req, res, next) => {
=======
const adminOnly = (req, res, next) => {
>>>>>>> 3f38929 (Added invoice PDF generation feature)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};
<<<<<<< HEAD
=======

module.exports = adminOnly;
>>>>>>> 3f38929 (Added invoice PDF generation feature)
