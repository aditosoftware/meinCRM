import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "SHIPREASON"],
[2, "FISCALYEAR"],
[3, "PRODUCT_ID"],
[4, "QUANTITY"],
[5, "INITIATOR_ID"],
[6, "SENDER_ID"],
[7, "SHIPDATE"],
[8, "SHIPSTATUS"]
];

var vkfields = [[a.valueof("$comp.relationid"), "RELATION_ID"]];
instable(fields, vkfields, row, "ADVERTISINGSHIPMENT", "ADVERTISINGSHIPMENTID", "$comp.tblAdvertisingShipments");