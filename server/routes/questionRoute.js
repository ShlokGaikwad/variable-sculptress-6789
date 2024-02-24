const express = require("express") ;
const QuestionModel = require("../models/questionModel") ;
const auth = require("../middleware/auth.middleware") ;
const access = require("../middleware/access.middleware");

const questionRouter = express.Router() ;

questionRouter.get("/", async (req, res) => {
    try {
        const { level, lang } = req.query;
        const filter = {};

        if (level) {
            filter.level = level;
        }

        if (lang) {
            filter.languageName = lang;
        }

        const question = await QuestionModel.find(filter);
        res.status(200).send({ "msg": question });
    } catch (error) {
        res.status(500).send({ "msg": error.message });
        console.log(error.message);
    }
});

questionRouter.post("/create" , auth , access("Admin") , async(req, res) => {
    try {
        const question = new QuestionModel(req.body) ;
        await question.save() ;
        res.status(201).send({ "msg" : "New question has been created" }) ;
    } catch(error) {
        res.status(500).send( "Internal Error" ) ;
        console.log( "Error while creating new question : ", error.message) ;
    }
}) ;

questionRouter.delete("/:id" , auth , access("Admin") , async(req, res) => {
    try {
        const questionID  = req.params.id ;
         await QuestionModel.findByIdAndDelete(questionID) ;
        res.status(201).send({ "msg" : `Question with id : ${questionID} has been deleted` }) ;
    } catch(error) {
        res.status(500).send( "Internal Error" ) ;
        console.log( "Error while creating new question : ", error.message) ;
    }
}) ;

questionRouter.patch("/update/:id" , auth , access("Admin") , async(req, res) => {
    try {
        const  questionID  = req.params.id ;
        await QuestionModel.findByIdAndUpdate(questionID) ;
        res.status(201).send({ "msg" : `Question with id : ${questionID} has been updated` }) ;
    } catch(error) {
        res.status(500).send( "Internal Error" ) ;
        console.log( "Error while creating new question : ", error.message) ;
    }
}) ;



module.exports = questionRouter ;