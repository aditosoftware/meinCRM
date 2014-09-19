import("lib_keyword");

var commid = a.valueof("$comp.Label_comm_dec");
var medium = "PersMedium";
var relationid = a.valueof("$comp.Label_relpers_dec");
if (relationid == "")	
{
    relationid = a.valueof("$comp.relationid");
    medium = "OrgMedium";
}
//zurücksetzen des Standardflags auf 0 für alle Relationen der Person
var spalte = new Array("standard");
var typen = a.getColumnTypes( "COMM", spalte);
a.sqlUpdate("COMM", spalte, typen, new Array("0")
    , "medium_id in (select keyvalue from keyword where" + getKeyTypeSQL(medium) + " and keyname2 = 'fon') and relation_id = '" 
    + relationid + "'" );

//Jetzt für die markierte Relation das Standardflag setzten
a.sqlUpdate("COMM", spalte, typen, new Array("1"), "commid = '" + commid + "'" );
a.refresh("$comp.Table_comm");