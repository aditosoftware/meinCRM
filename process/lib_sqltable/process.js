/*
* verschiebt markierte Zeilen in einer TabellenComponente
*
* @param {String} pCompTable req Name der Tabellencomponente
* @param {String} pTable req Name der DBTabelle
* @param {String} pCondition req Condition der PositionsDatensätze
* @param {String []} pColumns req Array der DBSpaltenname ("POS", "DATE_EDIT")
*
* @return {void}
*/
function movePos( pCompTable, pTable, pCondition, pColumns )
{
	
    var markids = a.decodeMS( a.valueof(pCompTable) );
    if (markids.length > 0)
    {
        var posnew = a.askQuestion(a.translate("Verschieben nach Position ?"), a.QUESTION_EDIT, "");
        posnew = parseInt(posnew);
        var ctypes = a.getColumnTypes(pTable, pColumns)
			
        for ( var i = 0; i < markids.length; i++)		
            a.sqlUpdate( pTable, pColumns, ctypes, [ posnew + 1, a.valueof("$sys.date")], pTable + "ID = '" + markids[i] + "'");
        resortPos( pTable, pCondition, pColumns )
        a.refresh(pCompTable);
    }
}

/*
* löscht markierte Zeilen in einer TabellenComponente
*
* @param {String} pCompTable req Name der Tabellencomponente
* @param {String} pTable req Name der DBTabelle
* @param {String} pCondition req Condition der PositionsDatensätze
* @param {String []} pColumns req Array der DBSpaltenname ("POS", "DATE_EDIT")
*
* @return {void}
*/
function deletePos( pCompTable, pTable, pCondition, pColumns )
{
    var markids = a.decodeMS( a.valueof(pCompTable) );

    if (markids.length > 0)
    {
        a.sqlDelete( pTable, pTable + "ID IN ('" + markids.join("','") + "')" );
        resortPos( pTable, pCondition, pColumns );
        a.refresh(pCompTable);
    }
}

/*
* sortiert Zeilen in einer DBTabelle neu
*
* @param {String} pTable req Name der DBTabelle
* @param {String} pCondition req Condition der PositionsDatensätze
* @param {String []} pColumns req Array der DBSpaltenname ("POS", "DATE_EDIT")
*
* @return {void}
*/
function resortPos( pTable, pCondition, pColumns )
{
    if ( pCondition != "")  pCondition = " where " + pCondition;
    var pos = a.sql("select " + pTable + "ID from " + pTable +  pCondition + " order by " + pColumns.join(",") + " desc", a.SQL_COLUMN);
    var ctypes = a.getColumnTypes(pTable, pColumns)

    for ( var i = 0; i < pos.length; i++)
        a.sqlUpdate( pTable, pColumns, ctypes, [i + 1, a.valueof("$sys.date")], pTable + "ID = '" + pos[i] + "'");
}