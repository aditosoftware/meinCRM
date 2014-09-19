var cols = a.decodeMS(a.valueof("$comp.tblColumns"));

// nur kopieren, wenn auch mindestens eine zeile ausgewählt wurde
if(cols.length >= 1)
{
    // ziel bestimmen
    var dlg = a.askUserQuestion(a.translate("Bitte Zieltabellen auswählen"), "DLG_REPO_TBLLIST");
    if(dlg != null)
    {
        var tables = a.decodeMS(dlg["DLG_REPO_TBLLIST.TABLES"]);
			
        // jetzt die ausgewählten Spalten in die ausgewählten Tabellen schreiben
        var spalten = ["COLUMNID", "COLUMNNAME", "COLUMNREF", "COLUMNSIZE", "CONSTRAINTTYPE", "CUSTOMIZED",
        "DATATYPE", "DESCRIPTION", "INTERNALUSE", "LONGNAME", "NULLABLE", "TABLEREF", "TABLE_ID",
        "USER_NEW", "DATE_NEW", "USER_EDIT", "DATE_EDIT" ];
        var typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_COLUMNREPOSITORY", spalten);
				
        for(var tblindex=0; tblindex < tables.length; tblindex++)
        {
            for(var colindex=0; colindex < cols.length; colindex++)
            {	
                var sql = " select " + spalten.join(", ") + 
                " from aosys_columnrepository " + 
                " where columnid = '" + cols[colindex] + "'";
                var werte = a.sql(sql, a.SQL_ROW);
                werte[12] = tables[tblindex];
                werte[13] = a.valueof("$sys.user");
                werte[14] = date.date();
                werte[15] = "";
                werte[16] = "";

                sql = " select columnid from aosys_columnrepository " + 
                    " where columnname = '" + werte[1] + "' and table_id = '" + tables[tblindex] + "'";
                var theID = a.sql(sql);
                if(theID == "") 
                {
                    werte[0] = a.getNewUUID();
                    a.sqlInsert("AOSYS_COLUMNREPOSITORY", spalten, typen, werte);
                }
                else
                {
                    werte[0] = theID;
                    a.sqlUpdate("AOSYS_COLUMNREPOSITORY", spalten, typen, werte, "COLUMNID = '" + theID + "'");
                }
            }
        }
    }
}