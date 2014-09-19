import("lib_bulkmail");
import("lib_storedSearches");
import("lib_grant");

var sel =  a.decodeMS(a.valueof("$comp.Combobox_Search"));
var mailid =  a.valueof("$comp.BULKMAILDEFID");
if ( sel.length > 0 && mailid != "" )
{
    var con = getStoredSelectionConditon(a.valueof("$sys.user"), sel[0], sel[1]);
    con = getGrantCondition( sel[0], con );
    if ( addRecipientsWithCondition( sel[0], con, mailid ) )
    {
        a.setValue("$comp.Combobox_Search", "")
        a.refresh("$comp.tblRcpt");
        a.refresh("$comp.label_anz_member");
    }
}