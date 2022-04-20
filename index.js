const express = require('express')
const getStudents = require('./router/student');
const getMentors = require('./router/mentor');
const db = require('./shared/connect')
const app = express()
app.use(express.json())
db.connect()
app.use("/",(req,res,next) => {
    console.log("hello welcome to middleware!")
    next();

})
app.use("/students",getStudents)
app.use("/mentors",getMentors)
app.listen(3001)
