import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "ENTRYDATE"],
[2, "BUYSELL"],
[3, "PRICELIST"],
[4, "FROMQUANTITY"],
[5, "PRICE"],
[6, "VAT"],
[7, "CURRENCY"]
];
var updanz = updtable(fields, row, "PRODUCTPRICE", "PRODUCTPRICEID");