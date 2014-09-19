import("lib_bulkmail");

var mailid =  a.valueof("$comp.BULKMAILDEFID");

if (  mailid != "" )
{
    var res = a.decodeMS(a.valueof("$comp.tblRcpt"));
    if ( deleteRecipientsWithCondition( "", "BULKMAILRCPTID in ('" + res.join("','") + "')", mailid ) )
    {
        a.refresh("$comp.label_anz_member");
        a.refresh("$comp.tblRcpt");
    }
}