(async () => {
  const path = require("path");
  const { Command } = require("commander");
  const program = new Command();
  program.option("-e, --env <env>", "Entorno de ejecucion", "production");
  program.parse();

  const { env } = program.opts();

  require("dotenv").config({
    path: path.join(
      __dirname,
      env == "development" ? ".env.development" : ".env"
    ),
  });

  const config = require("./config/config");

  console.log(config);

  const productsRouter = require("./routes/productsRouter");
  const cartsRouter = require("./routes/cartsRouter");
  const viewRouter = require("./routes/viewsRouter");
  const usersRouter = require("./routes/usersRouter");
  const authRouter = require("./routes/auth.router");
  const sessionsRouter = require("./routes/sessions.router");
  const notificationsRoutes = require ("./routes/notifications.router")

  const passport = require("passport");
  const initPassportLocal = require("./config/passport.local.config");

  const mongoose = require("mongoose");
  mongoose
    .connect(config.MONGO_URL)
    .then(() => console.log("se ha conectado a la base de datos"))
    .catch(() => console.log("no se ha conectado a la base de datos"));

  const express = require("express");
  const app = express();

  const { engine } = require("express-handlebars");

  const { Server } = require("socket.io");
  const http = require("http");
  const server = http.createServer(app);
  const io = new Server(server);

  const socketManager = require("./websocket/chat.socket");
  io.on("connection", socketManager);

  const session = require("express-session");

  const MongoStore = require("connect-mongo");

  const cookieParser = require("cookie-parser");

  const port = config.PORT;
  server.listen(port, () => {
    console.log(`Express Server Listening at http://localhost:${port}`);
  });
  io.on("connection", (socket) => {
    console.log(`Cliente Conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log("Cliente Desconectado");
    });

    socket.on("addProduct", () => {
      console.log("Producto agregado");
    });
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cookieParser("secreto"));
  app.use(
    session({
      secret: "secreto",
      resave: true,
      saveUninitialized: true,

      store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        ttl: 60 * 60,
      }),
    })
  );

  initPassportLocal();
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    next();
  });

  app.use("/api", productsRouter);

  app.use("/api", cartsRouter);

  app.use("/api", usersRouter);

  app.use("/api", authRouter);

  app.use("/api", sessionsRouter);

  app.use("/api", notificationsRoutes)

  app.use("/", viewRouter);
  app.engine("handlebars", engine());
  app.set("views", __dirname + "/views");
  app.set("view engine", "handlebars");

  app.use(express.static(__dirname + "/public"));
})();