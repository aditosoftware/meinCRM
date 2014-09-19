import("lib_dbschema")


var res = a.askUserQuestion(a.translate("Bitte Datenbanktyp auswählen"), "DLG_DBTYPESELECTION");

if(res != null)
{
    var sel = a.decodeMS(a.valueof("$comp.tblTablelist"));
    if (a.valueof("$comp.chk_allTables") == 'true')	sel = a.sql("select TABLEID from AOSYS_TABLEREPOSITORY", a.SQL_COLUMN);
    var dbtype = res["DLG_DBTYPESELECTION.comboDatabase"];
    var erg = checkDatabaseNamingLimits(dbtype, sel);

    if(erg.length > 0)
    {
        s = a.translate("Folgende Überschreitungen der Begrenzungen der gewählten Datenbank wurden gefunden:");
        s += "\n";
		
        for(var i = 0; i < erg.length; i++)
        {
            switch(erg[i][0])
            {
                case "tablenamelength" :
                    s += "Tabellenname " + erg[i][1] + " ist zu lang (maximal " + erg[i][3] + " Zeichen).\n";
                    break;
                case "columnnamelength" :
                    s += "Spaltenname " + erg[i][1] + "." + erg[i][2] + " ist zu lang (maximal " + erg[i][3] + " Zeichen).\n";
                    break;
                case "indexnamelength" :
                    s += "Indexname " + erg[i][2] + " für Tabelle " + erg[i][1] + " ist zu lang (maximal " + erg[i][3] + " Zeichen).\n";
                    break;
                case "indexcolumncount" :
                    s += "Index " + erg[i][2] + " für Tabelle " + erg[i][1] + " besitzt zu viele Spalten (maximal " + erg[i][3] + " Spalten).\n";
                    break;
                case "indexcount" :
                    s += "Tabelle " + erg[i][1] + " besitzt zu viele Indexdeklarationen (maximal " + erg[i][3] + " Indizes).\n";
                    break;
            }
        }
    }
    else
    {
        s = a.translate("Keine der ausgewählten Tabellen überschreitet die Begrenzungen der gewählten Datenbank.");
    }

    a.setValue("$comp.memoOutput", s);
    a.refresh("$comp.memoOutput");
	
}