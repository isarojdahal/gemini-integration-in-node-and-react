const cors = require("cors");
const express = require("express");
const routes = require("./routes/app.route");

class Server {
  constructor() {
    this.app = express();
    this.app.use(
      cors({
        origin: ["http://localhost:5173"],
      })
    );
    this.app.use(express.json());

    this.app.use("/ai", routes);
    this.intialize();
  }

  intialize() {
    this.app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  }
}

new Server();
