var data = a.sql("select LOCATIONID from AOSYS_LOCATION where " + a.valueof("$sys.selection"), a.SQL_COLUMN);
var quest = a.askQuestion("Wollen Sie wirklich alle " + data.length + " Datensätze verändern ?", a.QUESTION_YESNO, "")
if (quest == 'true')
{
    var col = ["SALESAREA"];
    var typ = a.getColumnTypes("AOSYS_LOCATION", col);
    var salesareaid = null;
    var salesareas = a.sql("select KEYNAME1 from KEYWORD where KEYTYPE = 53 order by KEYVALUE", a.SQL_COLUMN);

    var salesarea = a.askQuestion("Vertriebsgebiet = ", a.QUESTION_COMBOBOX, "|" + salesareas.join("|"));
    if (salesarea != null)
    {
        salesareaid = a.sql("select KEYVALUE from KEYWORD where KEYTYPE = 53 and KEYNAME1 = '" + salesarea + "'");

        for ( var i = 0; i < data.length; i++)
            a.sqlUpdate("AOSYS_LOCATION", col, typ, [salesareaid], "LOCATIONID = '" + data[i] + "'");
        a.refresh()
    }
}