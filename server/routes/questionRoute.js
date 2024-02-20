const express = require("express") ;
const QuestionModel = require("../models/questionModel") ;

const questionRouter = express.Router() ;

questionRouter.get("/" ,  async(req,res) => {
    try {
        const question = await QuestionModel.find() ;
        res.status(200).send({ "msg" : question }) ;
    } catch(error) {
        res.status(500).send({ "msg" : error.message }) ;
        console.log( error.message ) ;
    }
}) ;

questionRouter.post("/create" , auth , roleAcess("admin") , async(req, res) => {
    try {
        res.status(201).send({ "msg" : "New question has been created" }) ;
    } catch(error) {
        res.status(500).send( "Internal Error" ) ;
        console.log( "Error while creating new question : ", error.message) ;
    }
}) ;

questionRouter.delete("/delete/:id" , auth , roleAcess("admin") , async(req, res) => {
    try {
        const { questionID } = req.params.id ;
        res.status(201).send({ "msg" : `Question with id : ${questionID} has been deleted` }) ;
    } catch(error) {
        res.status(500).send( "Internal Error" ) ;
        console.log( "Error while creating new question : ", error.message) ;
    }
}) ;

questionRouter.patch("/update/:id" , auth , roleAcess("admin") , async(req, res) => {
    try {
        const { questionID } = req.params.id ;
        res.status(201).send({ "msg" : `Question with id : ${questionID} has been updated` }) ;
    } catch(error) {
        res.status(500).send( "Internal Error" ) ;
        console.log( "Error while creating new question : ", error.message) ;
    }
}) ;



module.exports = questionRouter ;