import("lib_email");

var id = a.decodeFirst(a.valueof("$comp.tblTeam"));
if (id != '')
{
	var relid = a.sql("select RELATION_ID from SPMEMBER where SPMEMBERID = '" + id + "'");
	var addr = a.sql("select addr from comm where medium_id = 3 and relation_id = '" + relid + "'");
	OpenNewMail(addr, relid, 1, "", "", "", "", [["SPID", "#Vertriebsprojekt:" + a.valueof("$comp.PROJECTNUMBER") + "#"]]); // Sprache 1 = Deutsch
}