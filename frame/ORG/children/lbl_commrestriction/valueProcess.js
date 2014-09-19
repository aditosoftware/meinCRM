import("lib_relation");
 
var text = ""; 
var relid = a.valueof("$comp.idcolumn");
if ( relid != "" )
{
    var medium = a.sql("select distinct " + getKeySQL( "COMMRESTRICTION", "MEDIUM" ) + " from COMMRESTRICTION where RELATION_ID = '" + relid + "'", a.SQL_COLUMN );
    text = medium.join(", ");
}
a.rs(text);