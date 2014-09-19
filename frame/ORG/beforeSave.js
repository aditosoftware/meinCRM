import("lib_duplicate");
import("lib_attr");

var ret = checkAddress();
if ( ret  && a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW )
{
    var hasDup = "";
    if (a.valueof("$comp.DUP_CHECK") != "1")
    {
        hasDup = hasOrgDuplicates(a.valueof("$comp.relationid"), getOrgFramePattern());
    }
    if ( hasDup != "" ) //... wenn Dubletten existieren:
    {
        // das Dubletten-Register angezeigen
        a.imagevar("$image.dupids", hasDup);
        a.refresh("$comp.Register_detail");
        a.refresh("$comp.Register_dub");
        ret = false;
    }
    else a.imagevar("$image.dupids", "");
}
// min und max Attribute überprüfen
if ( ret )	ret = checkAttrCount();
a.rs ( ret );

function checkAddress()
{
    var addresses = a.getTableData("$comp.tbl_ADDRESS", a.ALL);
    if ( addresses.length == 1 )  
    {
        a.setValue("$comp.ADDRESS_ID", addresses[0][0]);
    }
    var standardaddressid = a.valueof("$comp.ADDRESS_ID");
    for ( var i = 0; i < addresses.length; i++)
    {
        if ( addresses[i][0] == standardaddressid )
        {
            return true;
        }
    }	
    a.showMessage("Keine Standardadresse gesetzt !");
    if ( addresses.length == 0 )
    { 
        var id = a.addTableRow("$comp.tbl_ADDRESS");
        a.setValue("$comp.ADDRESS_ID", id);
        a.updateTableCell("$comp.tbl_ADDRESS", id, 1, "-51", "-51");
        a.updateTableCell("$comp.tbl_ADDRESS", id, 2, "1", getKeyName( "1", "AdressTyp"));
    }
    a.setFocus("$comp.Adressen");
    return false;	
}