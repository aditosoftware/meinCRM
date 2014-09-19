import("lib_tablecomp");
var row = a.valueofObj("$local.rowdata");
var fields = [
[4,"PRICELIST"], 
[5,"ENTRYDATE"],
[6,"FROMQUANTITY"], 
[7,"PRICE"]
];
var updanz = updtable(fields, a.valueofObj("$local.rowdata"), "PRODUCTPRICE", "PRODUCTPRICEID");