var MysqlJson = require('mysql-json');
const config = require('../config/app'); 
var mysqlJson = new MysqlJson({
    host : config.HOST,
    user : config.USER,
    password : config.PASSWORD,
    database :  config.DB
  });

  module.exports = {
    'findById' : function(tableName,Id){      
        return new Promise(function(resolve, reject) {   
            mysqlJson.findByPrimaryKey(tableName, Id, function(err, response) {
                if (!err) {
                    resolve({
                        'status':true,
                        'status_code':200,
                        "message":"response for your query",  
                        "data":response                     
                    });
                }else{
                    resolve({
                        'status':false,
                        'status_code':500,
                        'message':"error occur in insert data",
                        'error':err.sqlMessage 
                    });
                } 
            }); 
        });
    },
    'customQuery' : function(sqlQuery){  
        return new Promise(function(resolve, reject) {   
            mysqlJson.query(sqlQuery, function(err, response) {
                if (!err) {
                    resolve({
                        'status':true,
                        'status_code':200,
                        "message":"response for your query",
                        'data':response
                    });
                }else{
                    resolve({
                        'status':false,
                        'status_code':500,
                        'message':"error occur in insert data",
                        'error':err.sqlMessage 
                    });
                } 
            }); 
        });
    },
    'customQueryResponse' : function(sqlQuery){      
        return new Promise(function(resolve, reject) {   
            mysqlJson.query(sqlQuery, function(err, response) {
                if (!err) {
                    resolve(response);
                }else{
                    resolve(err);
                } 
            }); 
        });
    },
    'insertData' : function(tableName,jsonPayload){      
        return new Promise(function(resolve, reject) {   
            mysqlJson.insert(tableName, 
                jsonPayload
                , function(err, response) {
                if (!err) {
                    resolve({
                        'status':true,
                        'status_code':200,
                        'message':'New record inserted successfully' 
                    });
                }else{
                    resolve({
                        'status':false,
                        'status_code':500,
                        'message':"error occur in insert data",
                        'error':err.sqlMessage 
                    });
                } 
            }); 
        });
    },
    'updateData' : function(tableName,jsonPayload,wherePayload){  
        return new Promise(function(resolve, reject) {   
            mysqlJson.update(tableName,  
                jsonPayload,
                wherePayload
                , function(err, response) {
                if (!err) {
                    resolve({
                        'status':true,
                        'status_code':200,
                        'message':'New record updated successfully' 
                    });
                }else{
                    resolve({
                        'status':false,
                        'status_code':500,
                        'message':"error occur in update data",
                        'error':err.sqlMessage 
                    });
                } 
            }); 
        });
    },
    'deleteData' : function(tableName,wherePayload){      
        return new Promise(function(resolve, reject) {   
            mysqlJson.delete(tableName, 
                wherePayload,
                function(err, response) {
                if (!err) {
                    resolve({
                        'status':true,
                        'status_code':200,
                        "message":"Record deleted successfully" 
                    });
                }else{
                    resolve({
                        'status':false,
                        'status_code':500,
                        'message':"error occur in insert data",
                        'error':err.sqlMessage 
                    });
                } 
            }); 
        });
    }
};
  