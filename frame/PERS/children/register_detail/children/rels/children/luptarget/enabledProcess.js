import("lib_relation");

var ret = false;
var relobject = a.decodeMS(a.valueof("$comp.cmbRelationType"));

if ( relobject.length > 0 )
{
    var relationid =  a.decodeFirst(a.valueof("$comp.relTree"));
    if ( relationid == "" ) relationid = a.valueof("$comp.relationid");
    var reltype = getRelationType(relationid);
    if ( reltype == 1 && relobject[4] == "org" ) ret = true; 
    if ( reltype == 2 && relobject[4] == "priv" ) ret = true; 
    if ( reltype > 1 && relobject[4] == "pers" ) ret = true; 
    if ( reltype == 3 && relobject[4] == "rel" ) ret = true; 
}
if ( !ret ) a.setValue("$comp.lupTarget", ""); 
a.rs( ret );