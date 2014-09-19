import("lib_keyword");

//zuerst prüfen ob ein Email ausgewählt wurde und noch nicht standard ist
var comm = "";
var commid = a.valueof("$comp.Label_comm_dec");
if (commid != "")
{
    comm = a.sql("select keyname2, standard from comm join keyword on (medium_id = keyvalue) where "
        + getKeyTypeSQL("PersMedium") + " and commid = '" + commid + "'", a.SQL_ROW);
}
a.rs(a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT && comm[0] == "fon" && comm[1] != "1" )