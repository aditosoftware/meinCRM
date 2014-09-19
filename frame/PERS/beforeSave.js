import("lib_duplicate");
import("lib_attr");

var ret = checkAddress();
if ( ret && a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW )
{
    var hasDup = "";
    if (a.valueof("$comp.DUP_CHECK") != "1")
    {
        hasDup = hasPersDuplicates(a.valueof("$comp.relationid"), a.valueof("$comp.persid"), getPersFramePattern());
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
    if ( addresses.length == 1 )  a.setValue("$comp.ADDRESS_ID", addresses[0][0]);
    var standardaddressid = a.valueof("$comp.ADDRESS_ID");
    for ( var i = 0; i < addresses.length; i++)
    {
        if ( addresses[i][0] == standardaddressid ) return true;
    }
    a.showMessage("Keine Standardadresse gesetzt !");
    if ( addresses.length == 0 )
    { 
        var addrtype = a.valueof("$comp.AOTYPE")
        var id = a.addTableRow("$comp.tbl_ADDRESS");
        a.setValue("$comp.ADDRESS_ID", id);
        a.updateTableCell("$comp.tbl_ADDRESS", id, 1, "-51", "-51");
        a.updateTableCell("$comp.tbl_ADDRESS", id, 4, addrtype, getKeyName( addrtype, "AdressTyp"));
        var country = a.sql("select COUNTRY, NAME_DE from ADDRESS join RELATION on ADDRESS_ID = ADDRESSID and RELATIONID = '" 
            + a.valueof("$global.user_relationid") + "' join COUNTRYINFO on COUNTRY = ISO2", a.SQL_ROW); 
        a.updateTableCell("$comp.tbl_ADDRESS", id, 14, country[0], a.translate(country[1]));
        a.updateTableCell("$comp.tbl_ADDRESS", id, 3, a.valueof("$comp.relationid"), a.sql("select ORGNAME from ORG where ORGID = '" + a.valueof("$comp.lup_orgid") + "'"));
    }
    a.setFocus("$comp.Adressen");
    return false;	
}