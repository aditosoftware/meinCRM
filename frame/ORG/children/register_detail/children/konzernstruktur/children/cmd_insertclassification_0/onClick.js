import("lib_relation");
import("lib_objrelation");

var object = a.decodeMS(a.valueof("$comp.cmbRelationType"));
var sourceid = a.decodeFirst(a.valueof("$comp.relTree"));
if( sourceid == "" ) sourceid = a.valueof("$comp.relationid");

// Wenn hierachie und nicht referse dann RootID 
if ( object[2] == "true" && object[1] == "n" ) sourceid = getRootID ( sourceid, object[0] );

var endpoints = [ sourceid, a.valueof("$comp.lupTarget") ];

// Wenn keyname2 verwendet wird dann id tauschen
if ( object[1] == "r" ) endpoints.reverse();

var user = a.valueof("$sys.user");
var actdate = a.valueof("$sys.date");
var reldesc = a.valueof("$comp.ObjRelInfo");
var spalten = [ "OBJECTRELATIONID", "SOURCE_ID", "SOURCE_OBJECT", "DEST_ID", "DEST_OBJECT", "RELVALUE", "RELDESC", "USER_NEW", "DATE_NEW" ];
var werte = [ a.getNewUUID(), endpoints[0], getRelationType(endpoints[0]), endpoints[1], getRelationType(endpoints[1]), object[0], reldesc, user, actdate ];
var typen = a.getColumnTypes( "OBJECTRELATION", spalten );

a.sqlInsert("OBJECTRELATION", spalten, typen, werte);
a.refresh("$comp.relTree");	
a.setValue("$comp.lupTarget", "");