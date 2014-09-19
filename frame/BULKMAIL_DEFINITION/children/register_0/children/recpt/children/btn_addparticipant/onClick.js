import("lib_bulkmail");

var relationid = a.valueof("$comp.lup_relation");
var bmid = a.valueof("$comp.BULKMAILDEFID");

if( relationid != "" && bmid != "" )
{
    if ( a.sql("select count(*) from BULKMAILRCPT where RELATION_ID = '" + relationid + "' and BULKMAILDEF_ID = '" + bmid + "'") == 0)
    {
        var res = addRecipients( [[relationid, getMailingAddress(relationid)]], bmid );
        if ( res > 0 )	a.showMessage( a.translate("Keine E-Mail-Adresse gefunden"));
        a.refresh("$comp.tblRcpt");
        a.setValue("$comp.lup_relation", "");
        a.refresh("$comp.label_anz_member");
    }
    else a.showMessage( a.translate("Dieser Eintrag ist bereits vorhanden"));
}