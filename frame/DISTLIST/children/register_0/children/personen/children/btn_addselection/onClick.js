import("lib_distlist");
import("lib_storedSearches");
import("lib_grant");

var sel =  a.decodeMS(a.valueof("$comp.Combobox_Search"));
if (sel.length > 0)
{
    var con = getStoredSelectionConditon(a.valueof("$sys.user"), sel[0], sel[1]);
    con = getGrantCondition( sel[0], con );
    if ( addMembersWithCondition( sel[0], con, a.valueof("$comp.distlistid" )) > 0 )
    {
        a.setValue("$comp.Combobox_Search","");
        a.refresh("$comp.tbl_distlistmember");
        a.refresh("$comp.label_anz_member");
    }
}