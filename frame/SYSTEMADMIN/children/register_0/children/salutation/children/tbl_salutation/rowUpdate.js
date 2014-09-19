import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "LANGUAGE"],
[2, "SALUTATION"],
[3, "TITLE"],
[4, "HEADLINE"],
[5, "LETTERSALUTATION"],
[6, a.translate("SEX")]
];

updtable(fields, row, "SALUTATION", "SALUTATIONID");