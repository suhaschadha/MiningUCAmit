pragma solidity ^0.4.0;
contract smartcontract{
	
        string public DataID;
		string public HashData;

	//Add data, hash to Block Chain
	function smartcontract(string Data_ID,string Hash_Data) public {
        //NuclearD[DataID] = NuclearData(DataID,RealData, HashData, FileHash,block.number);
        DataID = Data_ID;
		HashData = Hash_Data;
        
    }
} 