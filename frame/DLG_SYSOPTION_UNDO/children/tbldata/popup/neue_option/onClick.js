// neue option erfassen und eintragen
var dlg = a.askUserQuestion(a.translate("Bitte Daten eingeben"), "DLG_SYSOPTION_EDIT");

if(dlg != null)
{
    var spalten = ["OPTIONID", "OPTIONNAME", "OPTIONVALUE", "USERNAME", "DATE_NEW", "USER_NEW" ];
    var typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_CONFIGURATION", spalten);
    var werte = [ a.getNewUUID(), 
    dlg["DLG_SYSOPTION_EDIT.comboName"], 
    dlg["DLG_SYSOPTION_EDIT.comboValue"], 
    dlg["DLG_SYSOPTION_EDIT.comboScope"], 
    date.date(),
    a.valueof("$sys.user") ];

    var theID = a.sql(" select optionid from aosys_configuration " + 
        " where upper(optionname) = upper('" + werte[1] + "') " + 
        " and upper(username) = upper('" + werte[3] + "') " +
        " and deldate is null ");

    if(theID == "")
    {             
        a.sqlInsert("AOSYS_CONFIGURATION", spalten, typen, werte);
    }
    else
    {
        var result = a.askQuestion(a.translate("Diese Option ist bereits vorhanden.\nWollen Sie den Wert überschreiben?"), a.QUESTION_YESNO, "");
        if(result == "true")
        {
            a.sqlUpdate("aosys_configuration", spalten, typen, werte, "OPTIONID = '" + theID + "'");
        }
    }
    a.refresh();
}