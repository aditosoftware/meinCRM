import("lib_sql");
if (a.askQuestion(a.translate("Sollen die übernommenen Daten aus der Datenbank entfernt werden?"), a.QUESTION_YESNO, "") == "true")
{
    var importdevid = a.valueof("$comp.IMPORTDEVID")
    var fields = new Array("IMPORTDATE", "DATE_EDIT", "USER_EDIT");
    var condition = "USER_NEW = 'IMP-" + a.valueof("$sys.user") + "' and " 
    + getTimeCondition("DATE_NEW", "=", a.valueof("$comp.IMPORTDATE") );
    var DSDel = new Array();
    DSDel.push( new Array("LEAD", "IMPORTDEV_ID = '" + importdevid + "'"));
    DSDel.push( new Array("ORG", condition ));
    DSDel.push( new Array("PERS", condition ));
    DSDel.push( new Array("RELATION", condition ));
    DSDel.push( new Array("ADDRESS", condition ));
    DSDel.push( new Array("HISTORY", condition ));
    DSDel.push( new Array("HISTORYLINK", condition ));
    DSDel.push( new Array("ATTRLINK", condition ));
    DSDel.push( new Array("COMM", condition ));

    a.sqlDelete( DSDel );
    a.sqlUpdate( "IMPORTDEV", fields, a.getColumnTypes("IMPORTDEV", fields), 
        new Array( "", a.valueof("$sys.date"), a.valueof("$sys.user") ), "IMPORTDEVID = '" + importdevid + "'");
    a.showMessage( a.translate("Übernahme zurückgenommen") );
    a.refresh();
}