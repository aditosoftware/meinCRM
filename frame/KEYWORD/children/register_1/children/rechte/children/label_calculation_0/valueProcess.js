var id = a.decodeFirst(a.valueof("$comp.tbl_rights") );

if (id != '')
{
	var data = a.getTableData("$comp.tbl_rights", [id]);

	if (data[0][2] == null)	a.updateTableCell("$comp.tbl_rights", id, 2, 1, a.translate("Ja"));
	if (data[0][3] == null)	a.updateTableCell("$comp.tbl_rights", id, 3, 1, a.translate("Ja"));
	if (data[0][4] == null)	a.updateTableCell("$comp.tbl_rights", id, 4, 1, a.translate("Ja"));
	if (data[0][5] == null)	a.updateTableCell("$comp.tbl_rights", id, 5, 1, a.translate("Ja"));
}