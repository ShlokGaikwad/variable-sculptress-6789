const express = require("express") ;
const QuestionModel = require("../models/questionModel") ;

const questionRouter = express.Router() ;

questionRouter.get("/" ,  async(req,res) => {
    try {
        const question = await QuestionModel.find() ;
        res.status(200).send({ "msg" : question }) ;
    } catch( error ) {
        res.status(500).send({ "msg" : error.message }) ;
        console.log( error.message ) ;
    }
}) ;

module.exports = questionRouter ;