import("lib_grant");

var idcolumn = a.valueof("$comp.idcolumn");
if (idcolumn != "")

{
    var teilnehmer = a.sql("select campaignparticipantid from campaignparticipant where campaign_id = '" + idcolumn + "'", a.SQL_COLUMN);

    if (teilnehmer.length > 0)
    {
        a.rs("false");
    }
    else
    {
        // Recht für Löschen
        a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")));
    }
}
else a.rs("false")