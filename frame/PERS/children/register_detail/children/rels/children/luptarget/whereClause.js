import("lib_sql");
import("lib_relation");

var relationid = a.decodeFirst(a.valueof("$comp.relTree"));

var object = a.decodeMS( a.valueof("$comp.cmbRelationType") );
var cond = "";

switch(object[3])
{
	case "priv" : cond = trim("ORG_ID") + " = '0'"; break;
	case "pers"  : cond = " PERS_ID is not null"; break;
	case "rel"  : cond = trim("ORG_ID") + " <> '0' and PERS_ID is not null"; break;
	case "org"  : cond = " PERS_ID is null"; break;
}

if ( cond != "" ) cond += " and ";
cond += " relationid not in ( select source_id from objectrelation where dest_id = '" + relationid + "')"
			+ " and relationid not in ( select dest_id from objectrelation where source_id = '" + relationid + "')"
			+ " and relationid <> '" + relationid + "'"

a.rs(getContactWhereString(cond));