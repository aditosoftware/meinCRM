var optionid = a.decodeFirst(a.valueof("$comp.tblOptions"));

if(optionid != "")
{
    var spalten = ["OPTIONID", "OPTIONNAME", "OPTIONVALUE", "USERNAME", "DATE_NEW", "USER_NEW" ];
    var typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_CONFIGURATION", spalten);
    var werte = a.sql("select " + spalten.join(",") + " from aosys_configuration where optionid = '" + optionid + "'", a.SQL_ROW);
	
    var locals = [ ["$local.comboName", werte[1] ]
    , ["$local.comboValue", werte[2] ] 
    , ["$local.comboScope", werte[3] ]
    ];

    for(var i=0; i < locals.length; i++) a.localvar(locals[i][0], locals[i][1]);	
	
    var dlg = a.askUserQuestion(a.translate("Bitte Daten eingeben"), "DLG_SYSOPTION_EDIT");

    if(dlg != null)
    {
        werte = [ optionid,
            dlg["DLG_SYSOPTION_EDIT.comboName"], 
            dlg["DLG_SYSOPTION_EDIT.comboValue"], 
            dlg["DLG_SYSOPTION_EDIT.comboScope"], 
            date.date(),
            a.valueof("$sys.user") ];
		              
        a.sqlUpdate("AOSYS_CONFIGURATION", spalten, typen, werte, "OPTIONID = '" + optionid + "'");
        a.refresh();
    }
}