import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "MEDIUM"],
[4, "REASON"]
];

var vkfields = [[a.valueof("$comp.idcolumn"), "RELATION_ID"]];
instable(fields, vkfields, row, "COMMRESTRICTION", "COMMRESTRICTIONID", "$comp.tbl_commrestriction");

//var relpersids = a.sql("select RELATIONID from RELATION "
//	+ " where ORG_ID = '" + a.valueof("$comp.orgid") + "' and PERS_ID is not NULL", a.SQL_COLUMN);
//var col = ["COMMRESTRICTIONID", "RELATION_ID", "MEDIUM", "REASON", "DATE_NEW", "USER_NEW"];
//var typ = a.getColumnTypes("COMMRESTRICTION", col);
//for (i=0; i<relpersids.length;i++)
//{
//	a.sqlInsert("COMMRESTRICTION", col, typ, [a.getNewUUID(), relpersids[i], row[1], 
//		row[4] + a.translate(" : gesetzt über Firma!"), a.valueof("$sys.date"), a.valueof("$sys.user")])
//}
//a.showMessage(a.translate("Werbeeinschränkung wurde zusätzlich bei allen %0 Mitarbeitern gesetzt", [relpersids.length]))
//a.refresh("$comp.lbl_commrestriction");