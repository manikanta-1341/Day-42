const express = require('express');
const router = express.Router();
var student=require("../module/student");
router.get('/',student.getStudents);
router.get('/:id',student.getStudent);
router.post("/create",student.createStudent);
router.put('/modify/:id',student.updateStudent);
router.delete('/delete/:id',student.deleteStudent);
router.patch("/:id/assign/mentor",student.assignMentor);
router.get("/without/mentor",student.withoutMentor);
router.patch("/:id/deleteMentor",student.deleteMentor)
module.exports = router;