const express = require('express');
const app = express();
const PORT = process.env.PORT;

require('./startup/middlewares.js')(app);
require('./startup/db.js')();
require('./startup/routes.js')(app);

app.listen(PORT, () => console.log(`LISTING ${PORT} ...`));
