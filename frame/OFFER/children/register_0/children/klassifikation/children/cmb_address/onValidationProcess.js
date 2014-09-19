import("lib_addr");

var ret = "";
var RelID = a.valueof("$comp.RELATION_ID");
var addrid = a.valueof("$comp.cmb_address");

if( RelID != "" && addrid != '')
{	
    ret = new AddrObject( RelID, addrid ).formatAddress("{on}\n{ai}\n{al} {bn}\n{cc} - {zc} {ci}");
    a.setValue("$comp.ADDRESS", ret);
    a.setValue("$comp.cmb_address", "");
}