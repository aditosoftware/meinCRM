import("lib_addr")

var details = "";
var relationid = a.valueof("$comp.relation_id");
if(relationid != "")
{
    details = new AddrObject( relationid ).getFormattedAddress();
}
a.rs(details);