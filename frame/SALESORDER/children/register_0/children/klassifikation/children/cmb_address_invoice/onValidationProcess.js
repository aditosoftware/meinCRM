import("lib_addr");

var ret = "";
var RelID = a.valueof("$comp.RELATION_ID");
var addrid = a.valueof("$comp.cmb_address_invoice");

if( RelID != "" && addrid != '')
{	
    ret = new AddrObject( RelID, addrid ).getFormattedAddress();
    a.setValue("$comp.ADDRESS_INVOICE", ret);
    a.setValue("$comp.cmb_address_invoice", "");
}