import("lib_keyword")
import("lib_validation")

var medium = a.valueof("$comp.Edit_medium");
var adresse = a.valueof("$comp.Edit_addr");

var mediumtype = "OrgMedium";
if ( a.valueof("$comp.Label_relpers_dec") != "" )	 mediumtype = "PersMedium";

if ( medium != "" && adresse != "" )
{
    mediumtype = a.sql("select keyname2 from keyword where " + getKeyTypeSQL(mediumtype) + " and keyvalue = " + medium);
    var addresses = a.getTableData("$comp.tbl_ADDRESS", a.ALL);
    var conutry = "";
    if (addresses.length > 0 )      conutry = addresses[0][12];
    var standardaddressid = a.valueof("$comp.ADDRESS_ID");
    for ( var i = 1; i < addresses.length; i++)
    {
        if ( addresses[i][0] == standardaddressid ) conutry = addresses[i][12];
    }
    adresse = doCommValidation( mediumtype, adresse, conutry);
    if ( adresse != "")		
        a.setValue("$comp.Edit_addr", adresse);	
}