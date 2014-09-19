import("lib_relation");
 
var text = ""; 
var relid = a.valueof("$comp.idcolumn");
if ( relid != "" && a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW )
{
    var orgrelidsql = a.sql("select RELATIONID from RELATION where PERS_ID is null and ORG_ID = '" 
        + a.valueof("$comp.lup_orgid") + "'");
	
    var medium = a.sql("select distinct " + getKeySQL( "COMMRESTRICTION", "MEDIUM" ) + " from COMMRESTRICTION where RELATION_ID in ( '" 
        + orgrelidsql + "', '" + relid + "')", a.SQL_COLUMN );
    text = medium.join(", ");
}
a.rs(text);