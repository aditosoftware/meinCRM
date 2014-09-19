import("lib_history");

//var ID = a.decodeFirst(a.valueof("$comp.tblAdvertisingShipments"));
var ids = a.decodeMS(a.valueofObj("$comp.tblAdvertisingShipments"))

if ( ids.length == 0 ) a.showMessage(a.translate("Markieren Sie eine oder mehrere Zeilen in 'Versendung' !"))
else
{
    var maid = a.sql("select relationid, " + concat(["lastname", "firstname"]) 
        + " from relation join pers on (pers_id = persid)"
        + " join employee on (employee.relation_id = relation.relationid)"
        + " where login = '" + a.valueof("$sys.user") + "'");


    a.localvar("$local.Edt_Datum", a.valueof("$sys.date"));
    a.localvar("$local.Cmb_Versender", maid);
    a.localvar("$local.Cmb_Status", "4"); //verschickt.
	
    var statusauswahl = a.askUserQuestion("", "DLG_WERBEMITTELVERWALTUNG");
    if(statusauswahl != null)
    {
        var versender = statusauswahl["DLG_WERBEMITTELVERWALTUNG.Cmb_Versender"];
        var datum = statusauswahl["DLG_WERBEMITTELVERWALTUNG.Edt_Datum"];
        var status = statusauswahl["DLG_WERBEMITTELVERWALTUNG.Cmb_Status"];

        var table = "ADVERTISINGSHIPMENT";
        var columns = ["SENDER_ID", "SHIPDATE", "SHIPSTATUS"];
        var columntyps = a.getColumnTypes(table, columns);
        var value = new Array(versender, datum, status);
        var sql = a.sql("select ADVERTISINGSHIPMENTID, SHIPDATE from ADVERTISINGSHIPMENT where ADVERTISINGSHIPMENTID in ('" + ids.join("','") + "')", a.SQL_COMPLETE);
        for ( i=0; i<sql.length; i++)
        {
            if (sql[i][1] == '') a.sqlUpdate(table, columns, columntyps, value, "ADVERTISINGSHIPMENTID = '" + sql[i][0] + "'")
        }
		
        a.refresh();
    }
}