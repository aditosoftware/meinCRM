import("lib_email");
var details = a.valueofObj("$global.RptOfferOrderDetails");
var orgid = a.sql("select ORG_ID from RELATION where RELATIONID = '" + details[1] + "'");
if (orgid.substr(0, 2) == '0 ') // Privatperson
{
    var count = a.sql("select count(*) from COMM where medium_id = 3 and STANDARD = 1 and RELATION_ID = '" + details[1] + "'");
    if (count == "0") a.showMessage("keine Standard-E-Mail Büro vorhanden !")
    else
        sendAutoMail( a.translate("Angebot") + " " + details[0], details[1], "Email_Angebot", details[2], "AGB", [], [["SPNR", details[5]]] );
}
else // Funktion - Person in Firma
{
    var orgrelid = a.sql("select RELATIONID from RELATION where ORG_ID = '" + orgid + "'");
    var relobjid = a.sql("select ORG_ID from OBJECTRELATION join RELATION on RELATIONID = DEST_ID where SOURCE_ID = '" + orgrelid + "' and RELVALUE = 9", a.SQL_COLUMN);
    relationid = a.sql("select RELATIONID from PERS join RELATION on PERSID = PERS_ID "
        + " where RELATION.STATUS = 1 and ORG_ID in ('" + orgid + "', '" + relobjid.join("','") + "')", a.SQL_COLUMN);
    a.localvar("$local.relids", "'" + relationid.join("','") + "'")
		
    relationid = a.askUserQuestion("Email", "DLG_CHOOSE_PERS_FOREMAIL")
    if ( relationid == null )	relationid = ""; //Abbruch geklickt
    else
    {
        var reltoid = relationid["DLG_CHOOSE_PERS_FOREMAIL.cmb_pers_to"];

        var relccid = a.decodeMS(relationid["DLG_CHOOSE_PERS_FOREMAIL.tbl_pers_cc"]);
        if (relccid.length == 0)	relationid = ""; // keine Person markiert und OK geklickt
        else	
            relccid = a.sql("select ADDR from COMM where MEDIUM_ID = 3 and STANDARD = 1 and "
                + "RELATION_ID in ('" + relccid.join("','") + "') and RELATION_ID <> '" + reltoid + "'", a.SQL_COLUMN);

        if ( reltoid != "" ) 
            sendAutoMail( a.translate(details[3]) + " " + details[0], reltoid, "Email_" + details[3], details[2], "AGB", relccid, [["SPNR", details[5]]] );
        else a.showMessage("Bitte einen Adressat in 'to' eintragen!")
    }
}