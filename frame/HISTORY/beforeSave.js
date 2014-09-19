import("lib_attr");

// min und max Attribute überprüfen
a.rs ( checkAttrCount() );

// Speichert bei Folgehistorie HISTORY_ID in Original-Historie
if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW && a.hasvar("$image.DefaultValues") )
{
    var historyid =	a.valueofObj("$image.DefaultValues")["$comp.HISTORY_ID"];
    if ( historyid != undefined )
        a.sqlUpdate("HISTORY", ["HISTORY_ID"], a.getColumnTypes("HISTORY", ["HISTORY_ID"]), [historyid], "HISTORY.HISTORYID = '" + historyid + "'")
}