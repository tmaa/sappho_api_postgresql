const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')

const PORT = process.env.PORT || 3001

dotenv.config();

//middleware
app.use(express.json());
app.use(cors());

//import routes
const usersRoutes = require("./routes/users")
const searchRoutes = require("./routes/search")

//routes
app.use("/api/users", usersRoutes)

app.use("/api/search", searchRoutes)

app.listen(PORT, () => console.log(`Server running on ${PORT}`))