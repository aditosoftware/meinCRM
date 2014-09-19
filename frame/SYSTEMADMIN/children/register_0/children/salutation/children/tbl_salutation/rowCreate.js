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

var maxsort = a.sql("select max(SORT) + 1 from SALUTATION ")
if (maxsort == '') maxsort = 1;
var vkfields = [[maxsort, "SORT"]];
instable(fields, vkfields, row, "SALUTATION", "SALUTATIONID");