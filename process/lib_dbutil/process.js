import("lib_util");

/*
* Kopiert von einer Datenbank alle Tabellen in eine andern Datenbank.
*
* @param {String} pSourceDB req QuelleDatenbank
* @param {String} pDestDB req ZielDatenbank
*
* @return {String} Meldung
*/
function CopyDB(pSourceDB, pDestDB) 
{
    var message = "";
    var tables = a.getTables(pSourceDB);
    for (var i = 0; i < tables.length; i++)
    {
        var anz = CopyDBTable(pSourceDB, pDestDB, tables[i]); 
        message += "In '" + tables[i] + "' " + anz + " DS kopiert./n";
    }
    return message;
}


/*
* Kopiert Daten von einer Tabelle einer Datenbank in eine andere Datenbank.
* 
* @param {String} pSourceDB req QuelleDatenbank
* @param {String} pDestDB req ZielDatenbank
* @param {String} pTable req zu kopierende Tabelle
* @param {String} pTruncateTable wenn "true", wird die zieltabelle vorher geleert
* @param {String} pIDColumn opt IDSpalte wenn angegeben wir jeder DS einzeln gelesen.
*
* @return {Integer} Anzahl der kopierten Datensätze
*
*
*/
function CopyDBTable(pSourceDB, pDestDB, pTable, pTruncateTable, pIDColumn) 
{
    var d_fields = a.getColumns( pDestDB, pTable);
    var ds;
    var withIDColumn;
    var s_fields = a.getColumns( pSourceDB, pTable);
    var fields = new Array();
    for ( var i = 0; i < s_fields.length; i++ )
        if ( hasElement( d_fields, s_fields[i], true ) ) fields.push( s_fields[i] )

    var types = a.getColumnTypes(pDestDB, pTable,fields)
    var anz = 0;
    var sqlstr =  "select " + fields.join(", ") + " from " + pTable;
    if(pTruncateTable == "true") a.sqlDelete(pTable, "1=1", pDestDB);
    // Daten lesen
    if ( pIDColumn != "" && pIDColumn != undefined )
    {
        ds = a.sql( "select " + pIDColumn + " from " + pTable, pSourceDB, a.SQL_COMPLETE);
        withIDColumn = true;
    }
    else
    {
        ds = a.sql(sqlstr, pSourceDB, a.SQL_COMPLETE);
        withIDColumn = false;
    }
    // Daten einfügen
    for (i = 0; i < ds.length; i++)
    {
        var dsvalue = ds[i];
        if ( withIDColumn ) dsvalue = a.sql( sqlstr + " where " + pIDColumn + " = '" + ds[i][0] + "'", pSourceDB, a.SQL_ROW);
        try
        {
            anz += a.sqlInsert(pTable, fields, types, dsvalue, pDestDB);
        }
        catch(err)
        {
            log.show(err);
            if ( a.askQuestion("Soll das Kopieren der Daten abgebrochen werden ?", a.QUESTION_YESNO, "") == "true" )
                return anz;
        }
    }
    return anz;
}

/*
* Kopiert Daten von einer Tabelle einer Datenbank in eine andere Datenbank.
*
* @param {String} pSourceDB req QuelleDatenbank
* @param {String} pDestDB req ZielDatenbank
* @param {String} pSourceTab req QuelleTabelle
* @param {String} pDestTab req ZielTabelle
* @param {String} pSourceCol req QuellSpalten
* @param {String} pDestCol req ZielSpalten
* @param {String} pTruncateTable wenn "true", wird die zieltabelle vorher geleert
* @param {String} pIDColumn opt IDSpalte wenn angegeben wir jeder DS einzeln gelesen.
*
* @return {Integer} Anzahl der kopierten Datensätze
*/

function CopySource2Dest(pSourceDB, pDestDB, pSourceTab, pDestTab, pSourceCol, pDestCol, pTruncateTable, pIDColumn) 
{
    var types = a.getColumnTypes(pDestDB, pDestTab, pDestCol)
    var anz = 0;
    var ds;
    var withIDColumn;
    var sqlstr =  "select " + pSourceCol.join(", ") + " from " + pSourceTab;
    if(pTruncateTable == "true") a.sqlDelete(pDestTab, "1=1", pDestDB);
    // Daten lesen
    if ( pIDColumn != "" && pIDColumn != undefined )
    {
        ds = a.sql( "select " + pIDColumn + " from " + pSourceTab, pSourceDB, a.SQL_COMPLETE);
        withIDColumn = true;
    }
    else
    {
        ds = a.sql(sqlstr, pSourceDB, a.SQL_COMPLETE);
        withIDColumn = false;
    }
    // Daten einfügen
    for (var i = 0; i < ds.length; i++)
    {
        var dsvalue = ds[i];
        if ( withIDColumn ) dsvalue = a.sql( sqlstr + " where " + pIDColumn + " = '" + ds[i][0] + "'", pSourceDB, a.SQL_ROW);
        try
        {
            anz += a.sqlInsert(pDestTab, pDestCol, types, dsvalue, pDestDB);
        }
        catch(err)
        {
            log.show(err);
            if ( a.askQuestion("Soll das Kopieren der Daten abgebrochen werden ?", a.QUESTION_YESNO, "") == "true" )
                return anz;
        }
    }
    return anz;
}