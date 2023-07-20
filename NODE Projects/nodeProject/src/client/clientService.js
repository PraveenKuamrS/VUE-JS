const clientModel = require('./clientModel.js');
var key = '123456789trytrytry';
var encryptor = require('simple-encryptor')(key);

module.exports.createClientDBService = (clientDetails) => {
  return new Promise((resolve, reject) => {
    var clientModelData = new clientModel();
    
    clientModelData.fullname = clientDetails.fullname;
    clientModelData.email = clientDetails.email;
    clientModelData.password = clientDetails.password;
    var encrypted = encryptor.encrypt(clientDetails.password);
    
    clientModelData.password = encrypted;
    
    clientModelData.save()
      .then((result) => {
        resolve(true);
      })
      .catch((error) => {
        reject(false);
      });
  });
}

module.exports.clientDBService = (clientDetails) => {
  return new Promise((resolve, reject) => {
    clientModel.findOne({ email: clientDetails.email })
      .then((result) => {
        if (result) {
          var decrypted = encryptor.decrypt(result.password);

          if (decrypted == clientDetails.password) {
            resolve({ status: true, message: "Student validated successfully" });
          } else {
            reject({ status: false, message: "Student not validated" });
          }
        } else {
          reject({ status: false, message: "Invalid student details" });
        }
      })
      .catch((error) => {
        reject({ status: false, message: "Error retrieving student details" });
      });
  });
}
  

module.exports.forgotDBService = (clientDetails) => {
  return new Promise((resolve, reject) => {
    clientModel.findOne({ email: clientDetails.email })
      .then(async (result) => {
        if (result) {
          // Email exists in the database, update password
          result.password = encryptor.encrypt(clientDetails.password); // Update the password in the document
          await result.save(); // Save the updated document
          resolve({ status: true, message: "Password updated successfully" });
        } else {
          reject({ status: false, message: "Invalid student details" });
        }
      })
      .catch((error) => {
        reject({ status: false, message: "Error retrieving student details" });
      });
  });
};

// module.exports.loginDBService=(clientDetails)=>
// {
//     return new Promise(function myFn(resolve,reject)
//     {
//         clientModel.findOne({email:clientDetails.email},function getresult(errorvalue,result)
//         {
//             if(errorvalue)
//             {
//                 reject({status:false,message:"Invalid Data"});
//             }
//             else
//             {
//                 if(result!=undefined && result!=null)
//                 {
//                     var decrypted=encryptor.decrypt(result.password);
    
//                     if(decrypted==clientDetails.password)
//                     {
//                         resolve({status:true,message:"Student validated succeesfully"});
//                     }
//                     else
//                     {
//                         reject({status:false,message:"Student not valisate"});
//                     }
//                 }
//                 else{
//                     reject({status:false,message:"Students error details"});
//                 }
//             }
//         });
       
//     }); 
// } 


// var clientModel= require('./clientModel.js');
// var key='123456789trytrytry';
// var encryptor=require('simple-encryptor')(key);

// module.exports.createStudentDBService=(clientDetails)=>{
//     return new Promise(function myFn(resolves ,rejects){
        
//         var clientModelData=new clientModel();
       
//         clientModelData.firstNmae=clientDetails.firstNmae;
//         clientModelData.lastname=clientDetails.lastname;
//         clientModelData.email=clientDetails.email;
//         clientModelData.password=clientDetails.password;
//         var encrypted=encryptor.encrypt(clientDetails.password);

//         clientModelData.password=encrypted;

//         clientModelData.save(function resultHandle(error,result){
//             if(error){
//                 rejects(false);

//             }else{
//                 resolves(true);
//             } 
//         });
//     });
// }

