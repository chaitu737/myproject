const express = require('express');
const router = express.Router();
const transactionModel = require('../models/transactions');
const voucherModel = require('../models/voucher')   ;
const csvtojson = require("csvtojson");


router.get('/import-data', (req, res) => {
    csvtojson()
  .fromFile("transactions - Sheet1.csv")
  .then(csvData => {
    transactionModel.insertMany(csvData, (err, data) => {
        if (err) {
          res.status(400).json({
            message: "Something went wrong!",
          });
        } else {
            csvtojson()
            .fromFile("vouchers - Sheet1.csv")
            .then(csvData => {
              voucherModel.insertMany(csvData, (err, data) => {
                  if (err) {
                    res.status(400).json({
                      message: "Something went wrong!",
                    });
                  } else {
                    res.status(200).json({
                      message: "File Uploaded Successfully!",
                      result: data,
                    });
                  }
                });
          
          
          
          
                
          
          
          
            });

        }
      });




      



  });
 


});


router.get('/output', async(req,res)=>{
  let voucherData, transacData;
  let diffamount= []

 await voucherModel.find({}, {_id:0,voucherCode:1, amount:1 }).exec((err, data)=>{
   voucherData= data;
 });
 await transactionModel.find({}, {_id:0,txnId:1, amount:1 },).exec((err, data)=>{
    transacData= data;
    let output= [];
    let result = {};
let diffRequired=false;
    voucherData.forEach(e1 => {
      transacData.forEach(e2=>{
        if(e1.amount==e2.amount){
          result['txnId']=e2.txnId
          result['txnAmount']= e2.amount
          result['voucherAmount']=e1.amount
          result['voucherCode']=e1.voucherCode
          output.push(result);
        }else{
          diffRequired=true;
        }
        

      })
      
    });




    if(diffRequired){
      for(var key1 of  transacData){
        for( var key2 of voucherData){
             let differamount = key1.amount-key2.amount;
            if(differamount>0){
              diffamount.push(differamount);
            }
          
  
          
        }
        diffamount = [...new Set(diffamount)];
      
      

      }



      for(var i in diffamount){
        for(var p of voucherData){
          for(var q of transacData){
    
          if(diffamount.length>0){
          if(diffamount[i]==p.amount){
            if((q.amount=diffamount[i] + p.amount )){
              result['txnId']=q.txnId
              result['txnAmount']=q.amount
              result['voucherAmount']=p.amount
              result['voucherCode']=p.voucherCode
              result['txnId']=q.txnId
              result['txnAmount']=q.amount
              result['voucherAmount']=diffamount[i].amount
              result['voucherCode']=p.voucherCode
             
             
    console.log(output,'sacsacascasc');
            } 
    
          }
          
        }
      
        //  output= getUniqueListBy(output, 'txnId');
        //  console.log(output, 'cdcdsca');
    
    
    
    
    
    
          }
        }
    
      }
  
  
  //  for( var key2 of voucherData){
  //    console.log(key2.amount,diffamount);
  //   if(key2.amount==diffamount){
  //     console.log("found......",key2)
  //   }
     
  //  }
    }
   
  })
  console.log(diffamount,voucherData, transacData,'cadcdcdc');

 



})

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}


module.exports = router

