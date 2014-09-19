import("lib_campaign");
import("lib_storedSearches")

var sel =  a.decodeMS(a.valueof("$comp.Combobox_Search"));
if (sel.length > 0)
{
    var con = getStoredSelectionConditon(a.valueof("$sys.user"), sel[0], sel[1]);
    if ( deleteParticipantsWithCondition( sel[0], con, a.valueof("$comp.campaignid" )) > 0 )
    {
        a.setValue("$comp.Combobox_Search","");
        a.refresh("$comp.tbl_participants");
        a.refresh("$comp.Label_number_of_participants");
    }
}