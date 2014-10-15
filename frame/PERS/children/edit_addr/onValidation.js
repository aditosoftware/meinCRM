import("lib_keyword")
import("lib_validation")

var medium = a.valueof("$comp.Edit_medium");
var adresse = a.valueof("$comp.Edit_addr");

if ( medium != "" && adresse != "" )
{
    var mediumtype = a.sql("select keyname2 from keyword where " + getKeyTypeSQL("PersMedium") + " and keyvalue = " + medium);
    var addresses = a.getTableData("$comp.tbl_ADDRESS", a.ALL);
    var conutry = "";
    if (addresses.length > 0 )      conutry = addresses[0][14];
    var standardaddressid = a.valueof("$comp.ADDRESS_ID");
    for ( var i = 1; i < addresses.length; i++)
    {
        if ( addresses[i][0] == standardaddressid ) conutry = addresses[i][14];
    }
    adresse = doCommValidation( mediumtype, adresse, conutry);
    if ( adresse != "")		
        a.setValue("$comp.Edit_addr", adresse);	
}