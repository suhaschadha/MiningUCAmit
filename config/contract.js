var Web3 = require('web3');
var NodeURL = "http://13.126.168.128:22000";
var account = '0xed9d02e382b34818e88b88a309c7fe71e65f419d';
var PrivateTo = "ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc=";
var dbUrl = require("../config/db");
var contractFolder = '../contract/';
var abiDefination = require('../config/abi');
var mongojs = require("mongojs");

function GetContract() {
SetWeb3();
ContractCM = web3.eth.contract(abiandcode.abi).at(address);
}

function SetWeb3() {
if (typeof web3 !== 'undefined') { web3 = new Web3(web3.currentProvider); }
else { web3 = new Web3(new Web3.providers.HttpProvider(NodeURL)); }
} 

module.exports = {


  getData : function(Data_ID,callback) {
    var db = mongojs(dbUrl.url, ['SmartContract']);
    //db.SmartContracst.findOne({ contractid: Data_ID }, function (err, docc) {
      db.SmartContract.findOne({ contractid: Data_ID }, function (err, docc) {
      if (docc) {
        if (typeof web3 !== 'undefined') {
          web3 = new Web3(web3.currentProvider);
        }
        else {
          web3 = new Web3(new Web3.providers.HttpProvider(NodeURL));
        }
       var ContractAddress = docc.contractaddress;
       var abi = docc.abi;
       var MyContract = web3.eth.contract(abi).at(ContractAddress);
       //var Data = JSON.parse(MyContract.getHashData(Data_ID));
       //var Data = JSON.parse(MyContract.RealData(),MyContract.HashData(),MyContract.FileHash(),MyContract.blockNumber());
      var Data =[MyContract.HashData()];
       db.close();
      callback(Data);
      }
      });
  },

  saveData : function(Data_ID, HashData, callback){
    if (typeof web3 !== 'undefined') { web3 = new Web3(web3.currentProvider); }
    else { web3 = new Web3(new Web3.providers.HttpProvider(NodeURL)); }
    web3.eth.defaultAccount = account;
    var Bytecode = "608060405234801561001057600080fd5b506040516103ff3803806103ff83398101806040528101908080518201929190602001805182019291905050508160009080519060200190610053929190610072565b50806001908051906020019061006a929190610072565b505050610117565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100b357805160ff19168380011785556100e1565b828001600101855582156100e1579182015b828111156100e05782518255916020019190600101906100c5565b5b5090506100ee91906100f2565b5090565b61011491905b808211156101105760008160009055506001016100f8565b5090565b90565b6102d9806101266000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631bbc661214610051578063991ffe33146100e1575b600080fd5b34801561005d57600080fd5b50610066610171565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100a657808201518184015260208101905061008b565b50505050905090810190601f1680156100d35780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156100ed57600080fd5b506100f661020f565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561013657808201518184015260208101905061011b565b50505050905090810190601f1680156101635780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102075780601f106101dc57610100808354040283529160200191610207565b820191906000526020600020905b8154815290600101906020018083116101ea57829003601f168201915b505050505081565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102a55780601f1061027a576101008083540402835291602001916102a5565b820191906000526020600020905b81548152906001019060200180831161028857829003601f168201915b5050505050815600a165627a7a7230582050f8426a4bad847122dc99d2289b4a466ffae0c09108b676fbb6e3cc37acab8f0029";
    var simpleContract =web3.eth.contract(abiDefination.abi);
    var simple = simpleContract.new(JSON.stringify(Data_ID),JSON.stringify(HashData), { from: web3.eth.defaultAccount, data: Bytecode, gas: 30000000, privateFor: [PrivateTo] }, function (e, contract) {
      if (e) {
        console.log("err creating contract:", e);
      } else {
        if (!contract.address) {
          var transactionHash = contract.transactionHash;
          var contractaddress = contract.address;
          console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
        } else {
          var transactionHash = contract.transactionHash;
          var contractaddress = contract.address;
          console.log("Contract mined! Address: " + contract.address);
          //Save all the contract details in MongoDB
          var db = mongojs(dbUrl.url, ['SmartContract']);
          var cData = { 'contractid': JSON.stringify(Data_ID).replace(/"/g, ""),  'abi': abiDefination.abi, 'contractaddress': contractaddress, 'contracthash': transactionHash };
          db.SmartContract.insert(cData, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else { db.close(); //callback('ok', doc);
           callback("Saved");
          }
          });
        }
      }
    });
    
  }

};

