const express = require("express");
const app = express();
const path = require('path');
require('dotenv').config()
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
app.use('/api/user', userRoute);
app.use("/api/admin" , adminRoute);
//npm run build : terminal cmd 
app.use(express.static(path.join(__dirname, './client/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});
const port = process.env.PORT || 5001;

app.listen(port , () => console.log(`Node server started on on port ${port}`));