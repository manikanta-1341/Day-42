const { ObjectId } = require("mongodb");
const mongo = require("../shared/connect");

module.exports.getMentors = async (req, res, next) => {
  try {
    // console.log("in get mentors");
    var data = await mongo.db.collection("mentor").find().toArray();
    res.send(data);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);
  }
};
module.exports.getMentor = async (req, res, next) => {
  try {
    // console.log("in get mentor");
    var data = await mongo.db
      .collection("mentor")
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(data);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);
  }
};

module.exports.createMentor = async (req, res, next) => {
  try {
    // console.log("in create mentor");

    var data = await mongo.db.collection("mentor").insertOne(req.body);
    res.send(data);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);
  }
};

module.exports.updateMentor = async (req, res, next) => {
  try {
    var data = await mongo.db
      .collection("mentor")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: { ...req.body } });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.deleteMentor = async (req, res, next) => {
  try {
    var data = await mongo.db
      .collection("mentor")
      .remove({ _id: ObjectId(req.params.id) });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.MentorWithoutStudents = async (req, res, next) => {
  // console.log("in mwos");
  try {
    var mentor_data = await mongo.db.collection("mentor").find().toArray();
    var data = [];
    mentor_data.map((e) => {
      if (e.students) {
        // console.log(e);
        mentor_data.splice(mentor_data.indexOf(e), 0);
      } else {
        data.push(e);
        // console.log("data::", data);
      }
    });
    // console.log("data::", data);
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.assignStudent = async (req, res, next) => {
  try {
    const body = req.body
    // console.log(body)
    //checking in students in mentor
    for (var i = 0; i < body.students.length; i++) {
      var students_check = await mongo.db.collection("mentor").find({ students: { name: body.students[i].name, _id: ObjectId(body.students[i]._id) } }).toArray()
    }
    // console.log(students_check, students_check.length)
    if (students_check.length < 1) {
      let students_assign = body.students.map(async (e, i) => {
        e._id = ObjectId(e._id)
        await mongo.db.collection("mentor").updateOne({ _id: ObjectId(req.params.id) }, { $push: { students: body.students[i] } })
      })
      let mentor_assign = body.students.map(async (e, i) => {
        var mentor_details = await mongo.db.collection("mentor").find({ _id: ObjectId(req.params.id) }).toArray();
        // console.log(mentor_details)
        await mongo.db.collection("student").updateOne({ _id: ObjectId(e._id) }, { $set: { mentor: { name: mentor_details[0].name, _id: mentor_details[0]._id } } })

      })
      res.send("success")

    }
    else {
      // console.log("in else:::", students_check)
      students_check.map((e) => {
        if (e._id.equals(ObjectId(req.params.id))) {
          // console.log(" in if same::", e._id, ObjectId(req.params.id))
          res.send("one of the students already assigned")
        }
        else {
          // console.log("in else same::", e._id, ObjectId(req.params.id))
          let students_assign = body.students.map(async (e, i) => {
            e._id = ObjectId(e._id)
            await mongo.db.collection("mentor").updateOne({ _id: ObjectId(req.params.id) }, { $push: { students: body.students[i] } })
          })
          let mentor_assign = body.students.map(async (e, i) => {
            var mentor_details = await mongo.db.collection("mentor").find({ _id: ObjectId(req.params.id) }).toArray();
            // console.log("mentor_details",mentor_details)
            await mongo.db.collection("student").updateOne({ _id: ObjectId(e._id) }, { $set: { mentor: { name: mentor_details[0].name, _id: mentor_details[0]._id } } })

          })
          students_check.map((e) =>{
             // console.log("e in delete",e)
            body.students.map(async(el) =>{
              //  console.log("el in delete",el)
              let x = await mongo.db.collection("mentor").updateMany( { _id: e._id} , {$pull : {students : { name : el.name , _id : el._id }}} , {multi :true})
              // console.log("in delete",el._id,el.name,e._id,"x::",x)

            })

          })
          res.send("success")
        }
      })

    }
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);
  }
};
