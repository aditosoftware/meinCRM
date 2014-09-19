import("lib_grant");

var id = a.valueof("$comp.SALESPROJECTID");
var offer = a.sql("select count(OFFERID) from OFFER where PROJECT_ID = '" + id + "'");
var spmember = a.sql("select count(*) from SPMEMBER where SALESPROJECT_ID = '" + id + "'");
if (offer > 0 || spmember > 0)
{
	a.rs("false");
}
else
{
	// Recht für Löschen
	a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")));
}