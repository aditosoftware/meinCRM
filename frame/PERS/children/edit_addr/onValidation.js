import("lib_keyword")
import("lib_validation")

var country = ""; 
var medium = a.valueof("$comp.Edit_medium");
var adresse = a.valueof("$comp.Edit_addr");

var  addrdata = a.getTableData("$comp.tbl_ADDRESS", a.valueof("$comp.ADDRESS_ID") );
if ( addrdata == null )  addrdata = a.getTableData("$comp.tbl_ADDRESS", a.ALL )[0];
if( addrdata != undefined )  country = addrdata[14]; 

if ( medium != "" && adresse != "" )
{
    // Validierung durchgeführt
    var mediumtype = a.sql("select keyname2 from keyword where " + getKeyTypeSQL("PersMedium") + " and keyvalue = " + medium);
    adresse = doCommValidation( mediumtype, adresse, country);
    if ( adresse != "")		a.setValue("$comp.Edit_addr", adresse);	
}