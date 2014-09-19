var tabelle = a.valueofObj("$image.ImportValues");
var importdevid = a.valueof("$comp.IMPORTDEVID");
var tab = a.createEmptyTable(3);

if (tabelle != "" && importdevid != "")
{
    tab = new Array();
    for ( var i = 0; i < tabelle[0].length; i++ )
    {
        var field = a.sql("select FIELDNAME from IMPORTFIELDDEV where IMPORTDEV_ID = '" + importdevid + "' and FIELDNUMBER = " + i);
        tab.push( new Array( eMath.absInt(i),  tabelle[0][i], field ));
    }
}
a.ro(tab);