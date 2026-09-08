require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

require("./events/user.events");
require("./events/appointment.events");
require("./events/payment.events");
require("./events/notification.events");

const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});