var file = a.askQuestion(a.translate("Importdatei wählen !"), a.QUESTION_FILECHOOSER, "" )

if (file != null)
{
    var daten = a.doClientIntermediate(a.CLIENTCMD_GETDATA, new Array(file, a.DATA_TEXT, "UTF-8"));
    var tabelle = a.parseCSV( daten.replace(/(^\s+)|(\s+$)/g,""), "\n", ";", '""'.charAt(0) );
    var country = tabelle[1][0];
    var quest = a.askQuestion("Wollen Sie wirklich die vorhandenen Datensätze aus '" + country + "' löschen und  " + tabelle.length + " Datensätze neu eintragen ?", a.QUESTION_YESNO, "")
if (quest == 'true')
{

    a.imagevar("$image.ImportValues", tabelle);

    var col = ["LOCATIONID", "COUNTRY", "STATE", "REGION", "DISTRICT", "ZIP", "CITY", "LAT", "LON", "DATE_NEW", "USER_NEW"];
    var typ = a.getColumnTypes("AOSYS_LOCATION", col);
    var val = a.valueofObj("$image.ImportValues");
    var datum = a.valueof("$sys.date");
    var user = a.valueof("$sys.user");
    var table = [];

    country = tabelle[1][0]; // nur die Daten von dem zu importierenden Land löschen
    a.sqlDelete("AOSYS_LOCATION", " COUNTRY = '" + country + "'")

    for (i=1; i<val.length; i++)
    {
        if (val[i][1] == 'DE')
        {
            table = [a.getNewUUID(), val[i][0], val[i][4], val[i][5], val[i][6], val[i][8], val[i][9], val[i][12].replace(",", "."), val[i][13].replace(",", "."), datum, user]
            a.sqlInsert("AOSYS_LOCATION", col, typ, table)
        }
    }

    var sql = a.sql("select LOCATIONID, ZIP, CITY from AOSYS_LOCATION order by ZIP, CITY", a.SQL_COMPLETE);

    var z = 0;
    for (i=1;i<sql.length;i++)
    {
        if (sql[i-1][1] == sql[i][1] && sql[i-1][2] == sql[i][2] )
        { 
            a.sqlDelete("AOSYS_LOCATION", " LOCATIONID = '" + sql[i][0] + "'")
            z++
        }
    }
    a.showMessage("Alle Datensätze aus '" + country + "' gelöscht\n" + tabelle.length + " Datensätze aus '" + country + "' hinzugefügt\n" + z + " Mehrfach ZIP-CITY gelöscht")
}
}