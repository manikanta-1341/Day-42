const { ObjectId } = require("mongodb");
const mongo = require("../shared/connect");

module.exports.getStudents = async (req, res, next) => {
  try {
    console.log("in get student");
    var data = await mongo.db.collection("student").find().toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
module.exports.getStudent = async (req, res, next) => {
  try {
    console.log("in get student");
    var data = await mongo.db
      .collection("student")
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.createStudent = async (req, res, next) => {
  try {
    console.log("in create student");

    var data = await mongo.db.collection("student").insertOne(req.body);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.updateStudent = async (req, res, next) => {
  try {
    var data = await mongo.db
      .collection("student")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: { ...req.body } });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.deleteStudent = async (req, res, next) => {
  try {
    var data = await mongo.db
      .collection("student")
      .remove({ _id: ObjectId(req.params.id) });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.withoutMentor = async (req, res, next) => {
  console.log("in SWOM");
  try {
    var student_data = await mongo.db.collection("student").find().toArray();
    console.log(student_data);

    var data = [];
    student_data.map((e) => {
      if (e.mentor) {
        console.log(e);
        student_data.splice(student_data.indexOf(e), 0);
      } else {
        data.push(e);
        console.log("data::", data);
      }
    });
    console.log("data::", data);
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.assignMentor = async (req, res, next) => {
  console.log("in assign mentor");
  try {
    var student_details = await mongo.db
      .collection("student")
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    console.log(student_details)
    if (req.body.mentor && !req.body.mentor[0] ) {
      console.log("req.body", req.body);
      // adding mentor details to student
      await mongo.db
        .collection("student")
        .updateOne(
          { _id: ObjectId(req.params.id) },
          { $set: { mentor: [{ ...req.body.mentor }] } }
        ); 
      let mentor_details = await mongo.db
        .collection("mentor")
        .findOne({ _id: ObjectId(req.body.mentor._id) })
      console.log(mentor_details,req.params.mentorId,typeof(req.params.mentorId), typeof(req.params.id));
      if(!mentor_details.students)
      {
        await mongo.db.collection("mentor").updateOne({ _id: ObjectId(req.body.mentor._id) },
          {
            $push: {
              students: {
                name: student_details[0].name,
                _id: ObjectId(student_details[0]._id),
              },
            },
          }
        );
      res.send(student_details)
      }
      else{
        res.send(" student already assigned")
      }
    }
    else{
      res.send("input must be in object of object (or) key must be mentor")
    }
  }
  catch(err){
    console.log(err)
    res.status(500).send(err);
  }
}
module.exports.deleteMentor = async(req, res, next) =>{
  const student_details = await mongo.db.collection("student").updateOne({_id : ObjectId(req.params.id) },{$unset :{"mentor" : ""}})
  await mongo.db.collection("mentor").updateOne({"students._id" : ObjectId(req.params.id) },{$unset :{"students" : ""}})
  res.send(student_details)
}