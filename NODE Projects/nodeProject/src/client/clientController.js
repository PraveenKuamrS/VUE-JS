var clientService=require('./clientService');

var createClientController=async (req,res)=>
{

    try
    {
console.log(res +"THis is req");
console.log(req.body);
var status=await clientService.createClientDBService(req.body);
console.log(status);
if(status){
    res.send({"status":true,'message':"User created Succes"});
}else{
    res.send({"status":false,'message':"User NOT created "});
}
    }
    catch(err)
    {
console.log(err);
    }
}



var clientLoginController=async (req,res)=>
{
 var result=null;
    try
    {
console.log(req.body);    
result=await clientService.clientDBService(req.body);
console.log(result.status);
if(result.status){
    res.send({"status":true,'message':result.msg});
}else{
    res.send({"status":false,'message':result.msg});
}
    }
    catch(err)
    {
console.log(err);
res.send({"status":false,"message":err.msg})
    }
}

var forgotPasswordControllerFn = async (req, res) => {
    try {
      console.log(req.body);
      const result = await clientService.forgotDBService(req.body);
      console.log(result.status);
      if (result.status) {
        res.send({ status: true, message: result.msg });
      } else {
        res.send({ status: false, message: result.msg });
      }
    } catch (err) {
      console.log(err);
      res.send({ status: false, message: err.msg });
    }
  };
  

module.exports={createClientController,clientLoginController,forgotPasswordControllerFn};
