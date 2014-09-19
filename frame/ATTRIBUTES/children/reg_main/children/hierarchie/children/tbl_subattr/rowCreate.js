import("lib_tablecomp");

var idcolumn = a.valueof("$comp.idcolumn");
var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "ATTRNAME"],
[2, "ATTRCOMPONENT"],
[3, "ATTRDATADEFINITION"],
[4, "AOACTIVE"],
[5, "ATTRSORT"]
];

// setzt in SubAttr für Combo und SelectCombo die gleiche Verwendung wie in Attr
if (row[2] == 1 || row[2] == 7)
{
    var obj = a.sql("select ATTROBJECT from ATTROBJECT where ATTR_ID = '" + idcolumn + "'", a.SQL_COLUMN);
    for (i=0; i<obj.length; i++)
    {
        var col = ["ATTROBJECTID", "ATTROBJECT", "ATTR_ID", "DATE_NEW", "USER_NEW"];
        var typ = a.getColumnTypes("ATTROBJECT", col);
        a.sqlInsert("ATTROBJECT", col, typ, [a.getNewUUID(), obj[i], row[0], a.valueof("$sys.date"), a.valueof("$sys.user")])
    }
}

var vkfields = [[idcolumn, "ATTR_ID"], ["0", "ATTRVALUE1"], ["-1", "ATTRVALUE2"]]; // Schriftfarbe sw, HintergrFarbe ws
var updanz = instable(fields, vkfields, row, "ATTR", "ATTRID");