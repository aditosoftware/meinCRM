import("lib_bulkmail");

var dlist = a.valueof("$comp.lup_distlist");
var mailid =  a.valueof("$comp.BULKMAILDEFID");

if ( dlist != "" && mailid != "" )
{
    if ( deleteRecipientsWithCondition( "DISTLIST", "DISTLIST_ID = '" + dlist + "'", mailid ) )
    {
        a.setValue("$comp.lup_distlist", "");
        a.refresh("$comp.label_anz_member");
        a.refresh("$comp.tblRcpt");
    }
}