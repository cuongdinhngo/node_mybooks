module.exports = function(app){
    app.use('/api/publishers', require('../routes/publishers.js'));
    app.use('/api/users', require('../routes/users.js'))
}