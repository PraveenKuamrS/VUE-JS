var express = require('express')

var studentController=require('../src/student/studentController');
var clientController=require('../src/client/clientController');

const router =express.Router();

router.route('/student/create').post(studentController.createStudentControllerFn);
router.route('/student/login').post(studentController.loginStudentControllerFn);
router.route('/student/forgotpass').put(studentController.forgotPasswordControllerFn);
router.route('/client/create').post(clientController.createClientController);
router.route('/client/login').post(clientController.clientLoginController);

module.exports=router;  