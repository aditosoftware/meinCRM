import("lib_grant");
import("lib_frame");

var id = a.valueof("$comp.idcolumn");
var participants = a.sql("select count(*) from EVENTPARTICIPANT where EVENT_ID = '" + id + "'");

if (participants > 0)
{
    a.rs("false");
}
else
{
    // Recht für Löschen
    a.rs((a.valueof("$comp.EVENTSTATUS") < 3 || tools.hasRole(a.valueof("$sys.user"), "PROJECT_Fachadministrator")) && isgranted( "delete", id)); 
}