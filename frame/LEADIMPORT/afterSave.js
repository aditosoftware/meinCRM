import("lib_attr");
import("lib_linkedFrame");

// Feldzuordnungen kopieren
if (a.hasvar("$image.FromID"))
{
    var fromid = a.valueof("$image.FromID");
    if ( fromid != "" )
    {
        var fields = ["IMPORTDEV_ID", "FIELDNAME", "FIELDNUMBER", "DATE_NEW", "USER_NEW"];
        var types = a.getColumnTypes("IMPORTFIELDDEV", fields);
        var list = a.sql("select distinct FIELDNAME, FIELDNUMBER from IMPORTFIELDDEV where IMPORTDEV_ID = '" + fromid + "'", a.SQL_COMPLETE);
        var user = a.valueof("$sys.user");
        var actdate = a.valueof("$sys.date");
        for ( var i = 0; i < list.length; i++ )
        {
            var fvalues = [a.valueof("$comp.IMPORTDEVID"), list[i][0], list[i][1], actdate, user] 		
            a.sqlInsert("IMPORTFIELDDEV",fields, types, fvalues);
        }	
	
    }
    a.imagevar("$image.FromID", "");
    a.refresh("$comp.tbl_dev");
}

// Schliessen, Speichern, Aktualisieren von Superframe
swreturn();