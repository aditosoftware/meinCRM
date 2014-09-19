var id = a.decodeFirst(a.valueof("$comp.tblTeam"));
if (id != '')
{
	var addr = a.sql("select addr from comm where medium_id = 1 and relation_id = "
		+ "(select RELATION_ID from SPMEMBER where SPMEMBERID = '" + id + "')");
	a.showMessage(addr + "\n\nwird gewählt")
}