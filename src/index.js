const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload")
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(fileUpload({
    createParentPath: true
}))

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("dev"))
app.use('/files', express.static(`./src/controllers/uploads`));

require('./controllers/authController')(app);
require('./controllers/coinsController')(app);

app.listen(process.env.PORT || 8080);