const { Client, ContractFunctionParameters, ContractExecuteTransaction, ContractCreateFlow, Hbar, ContractCallQuery } = require("@hashgraph/sdk");
require("dotenv").config();
var Web3 = require("web3");
var web3 = new Web3();
let employeeContractJson = require("./build/contracts/EmployeeNew.json");
let abi = employeeContractJson.abi;
let bytecode = employeeContractJson.bytecode;

// needed, how can i get?????
// let mytoken = require("./build/contracts/EmployeeNew.json");
// const bytecode = mytoken.bytecode;
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);
//console.log(bytecode);
//--------------------------------------console.log("ERRROR")-------------------------;
async function main() {
    const contractID = await deployContract();
    await addEmployee(contractID);
    //await addEmployee(contractID); 
    await getAllEmployee(contractID);
}

async function deployContract() {
    console.log(`\nDeploying the contract`);
    console.log("---------------------------------------------------");
    const contractCreate = new ContractCreateFlow()
        .setGas(10000000)
        .setBytecode(bytecode)
        .setConstructorParameters(new ContractFunctionParameters().addString("Ravi").addUint256(11111).addUint256(10));
    //Submit the file to the Hedera test network signing with the transa 
    const submitTx = await contractCreate.execute(client);
    //Get the receipt of the file create transaction 
    const fileReceipt = await submitTx.getReceipt(client); 
    // console.log(fileReceipt);
    //Get the file ID from the receipt
    const bytecodeFileId = fileReceipt.contractId;
    //Log the file ID 
    console.log("The smart contract byte code file ID is " + bytecodeFileId);
    // console.log("ERROR"); 
    return bytecodeFileId;
}

async function addEmployee(contractID) {
    const contractExecTx = new ContractExecuteTransaction()
        //Set the contract ID to return the request for 
        .setContractId(contractID)
        //Set the gas for the query 
        .setGas(1000000)
        //Set the contract function to call 
        .setFunction("addEmployee", new ContractFunctionParameters().addString("Ayushi").addUint256(180214).addUint256(5))
    const submitExecTx = await contractExecTx.execute(client);
    //Get the receipt of the transaction 
    const receipt2 = await submitExecTx.getReceipt(client);
    //Confirm the transaction was executed successfully 
    console.log("---------------------------------------------------");
    console.log("The transaction status is " + receipt2.status.toString());
    console.log("---------------------------------------------------");
} console.log("---------------------------------------------------");

async function getAllEmployee(contractId) {
    const functionCallAsUint8Array = encodeFunctionCall("getAllEmployee", []);
    // query the contract 
    const contractCall = await new ContractCallQuery()
        .setContractId(contractId)
        .setFunctionParameters(functionCallAsUint8Array)
        .setQueryPayment(new Hbar(2))
        .setGas(100000)
        .execute(client);
    let results = decodeFunctionResult('getAllEmployee', contractCall.bytes);
    console.log("---------All---------");
    console.log(results);
}

function encodeFunctionCall(functionName, parameters) {
    const functionAbi = abi.find(func => (func.name === functionName && func.type === "function"));
    const encodedParametersHex = web3.eth.abi.encodeFunctionCall(functionAbi, parameters).slice(2);
    return Buffer.from(encodedParametersHex, 'hex');
}

function decodeFunctionResult(functionName, resultAsBytes) {
    const functionAbi = abi.find(func => func.name === functionName);
    const functionParameters = functionAbi.outputs;
    const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
    const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);
    return result;
}
main();