const currentUser = async (req, res) => {

    if (req.isAuthenticated()) {

        const currentUser = req.user;
      console.log(req.user);
      res.render("current", {
        style: "index.css",
        users: currentUser,
        isAdmin: req.session.user.role === "admin",
        isUser: req.session.user.role === "user",
      });
    } else {
      res.status(401).json({ message: "Usuario no autenticado" });
    }
  };
  
  module.exports = currentUser; 