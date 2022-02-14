const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan') //remove for prod

const PORT = process.env.PORT || 3001

dotenv.config();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))

//import routes
const accountRoutes = require("./routes/account")
const searchRoutes = require("./routes/search")
const actionsRoutes = require("./routes/actions")

//routes
app.use("/api/account", accountRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/actions", actionsRoutes)


app.listen(PORT, () => console.log(`Server running on ${PORT}`))