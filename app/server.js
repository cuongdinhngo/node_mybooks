const express = require('express');
const app = express();
const PORT = process.env.PORT;

require('./startup/middlewares.js')(app);
require('./startup/db.js')();

app.use('/api/publishers', require('./routes/publishers'));

app.listen(PORT, () => console.log(`LISTING ${PORT} ...`));
