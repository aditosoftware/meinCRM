import("lib_keyword");

var medium = "OrgMedium";
if ( a.valueof("$comp.Label_relpers_dec") != "" )	 medium = "PersMedium";
"$sys.workingmode"; // für Prozessausführung bei Workingmodeänderung
a.ro(getValueList(medium));