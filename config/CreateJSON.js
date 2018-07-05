module.exports = {
CreateJSONStock : function(JSONData, callback){
var JSONDataNew = {
      "id": JSON.stringify(JSONData._id).replace(/"/g, ""),
      "productname":JSONData.productname,
      "lotnumber":JSONData.lotnumber,
      "containernumber":JSONData.containernumber,
      "numberofdrums":JSONData.numberofdrums,
      "weight":JSONData.weight,
      "packagingdate":JSONData.packagingdate
    }
    callback(JSONDataNew);
  },
CreateJSONMining : function(JSONData,callback) {
    var JSONDataNew = {
      "id": JSON.stringify(JSONData._id).replace(/"/g, ""),
      "fileid":JSONData.fileid,
      "location":JSONData.location,
      "entitytype":JSONData.entitytype,
      "project":JSONData.project,
      "shipmentfiles":JSON.stringify(JSONData.shipmentfiles),
      "companyid":JSONData.miningcompanyid
    }
    callback(JSONDataNew);
  },
CreateJSONEnrichment : function(JSONData, callback){
var JSONDataNew = {
      "id": JSON.stringify(JSONData._id).replace(/"/g, ""),
      "productname":JSONData.productname,
      "lotnumber":JSONData.lotnumber,
      "cylindernumber":JSONData.cylindernumber,
      "weight":JSONData.weight,
      "packagingdate":JSONData.packagingdate,
      "drumpackagecertificationreport":JSONData.drumpackagecertificationreport,
      "inspectedby":JSONData.inspectedby,
      "inspecteddate":JSONData.inspecteddate,
      "consignee":JSONData.consignee,
      "logisticsserviceprovide":JSONData.logisticsserviceprovide,
      "containernumber":JSONData.containernumber,
      "containercertificateinspection":JSONData.containercertificateinspection,
      "shipmentnumber":JSONData.shipmentnumber,
      "dateshipment": JSONData.dateshipment,
      "contractnumber":JSONData.contractnumber,
      "shipmentnotificationdocumentnumber": JSONData.shipmentnotificationdocumentnumber,
      "exportlicensnumber":JSONData.exportlicensnumber,
      "dangerousgoodsdeclarationform":JSONData.dangerousgoodsdeclarationform,      
      "ISOcertificatenumberforinternationallogistics": JSONData.ISOcertificatenumberforinternationallogistics,
      "shipmentfiles":JSON.stringify(JSONData.shipmentfiles),
      "conversioncompanyid": JSONData.conversioncompanyid
    }
    callback(JSONDataNew);
  },
CreateJSONFabrication : function(JSONData, callback){
var JSONDataNew = {
      "id": JSON.stringify(JSONData._id).replace(/"/g, ""),
      "namefacility":JSONData.namefacility,
      "postaladdress":JSONData.postaladdress,
      "country":JSONData.country,
      "owner":JSONData.owner,
      "operator":JSONData.operator,
      "facilitydiscription":JSONData.facilitydiscription,
      "facilitydiscription":JSONData.facilitypurpose,
      "facilitylayout":JSONData.facilitylayout,
      "shiftinchargename":JSONData.shiftinchargename,
      "safetyinchargename":JSONData.safetyinchargename,
      "FabricationCompanyId":JSONData.FabricationCompanyId, 
      "shipmentfiles":JSON.stringify(JSONData.shipmentfiles)
    }
    callback(JSONDataNew);
  },
CreateJSONPlant : function(JSONData, callback){
var JSONDataNew = {
      "id": JSON.stringify(JSONData._id).replace(/"/g, ""),
      "namefacility":JSONData.namefacility,
      "postaladdress":JSONData.postaladdress,
      "country":JSONData.country,
      "owner":JSONData.owner,
      "operator":JSONData.operator,
      "facilitydiscription":JSONData.facilitydiscription,
      "facilitypurpose":JSONData.facilitypurpose,
      "facilitylayout":JSONData.facilitylayout,
      "shiftinchargename":JSONData.shiftinchargename,
      "safetyinchargename":JSONData.safetyinchargename,
      "fabricationcompanyid":JSONData.fabricationcompanyid,
      "shipmentfiles":JSON.stringify(JSONData.shipmentfiles),
      "conversioncompanyid": JSONData.conversioncompanyid
    }
    callback(JSONDataNew);
  }
};