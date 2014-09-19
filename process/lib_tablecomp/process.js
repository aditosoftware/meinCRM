import("lib_util");
import("lib_sql");

/*
* Insert für Tabelle ab Version 3.1.
* 
* @param {String []} pRows req IDs  (Index, Spaltenname, Pflichteingabe - true)
* @param {[]} pVkRows req Verküpfungen
* @param {[]} pValues req Werte
* @param {String} pTable req Tabellenname
* @param {String} pIDField req ID
*
* @return {void}
*/
function instable( pRows, pVkRows, pValues, pTable, pIDField )
{
    var insanz = 0;
    var fname = [];
    var fvalue = [];
    var valdefault = [];
	
    for (var rind = 0; rind < pRows.length; rind++)
    {
        if (  pRows[rind][2] != undefined && ( pValues[ pRows[rind][0] ] == null ||  pValues[ pRows[rind][0] ] == "" ) )
        {
            return -rind;
        }
        if ( pValues[ pRows[rind][0] ] != null)
        {
            fname.push(pRows[rind][1]);
            fvalue.push( pValues[ pRows[rind][0] ] );
            valdefault.push( pRows[rind][1] );
        }
    }
    if ( fname.length > 0)
    {
        for (rind = 0; rind < pVkRows.length; rind++)
        {
            if ( ! hasElement(valdefault, pVkRows[rind][1] ))
            {
                fname.push( pVkRows[rind][1] );
                fvalue.push( pVkRows[rind][0] );
            }
        }
        fname.push(pIDField);
        fvalue.push( pValues[0] );
        if(fname.indexOf("DATE_NEW") == -1)
        {         
            fname.push("DATE_NEW");
            fvalue.push( a.valueof("$sys.date") );
        }

        if(fname.indexOf("USER_NEW") == -1)
        {    
            fname.push("USER_NEW");        
            fvalue.push( a.valueof("$sys.user") );
        }
        ftype = a.getColumnTypes(pTable, fname);
        if ( isDuplicat( pTable, fname, ftype, fvalue ) == "0" )
            insanz = a.sqlInsert( pTable, fname, ftype, fvalue );
    }
    return insanz;
}

/*
* Update für Tabelle ab Version 3.1.
* 
* @param {String []} pRows req IDs
* @param {[]} pValues req Werte
* @param {String} pTable req Tabellenname
* @param {String} pIDField req ID
* @param {String} pFields opt weitere FeldInhalte
*
* @return {void}
*/
function updtable( pRows, pValues, pTable, pIDField, pFields )
{
    var updanz = 0;
    var fname = [];
    var fvalue = [];
	
    if ( pFields == undefined ) pFields = [];
    for ( var rind = 0; rind < pRows.length; rind++)
    {
        if ( pValues[ pRows[rind][0] ] != null)
        {
            fname.push(pRows[rind][1]);
            fvalue.push( pValues[ pRows[rind][0] ] );
        }
    }
    if ( fname.length > 0)
    {		
        for (rind = 0; rind < pFields.length; rind++)
        {
            fname.push( pFields[rind][1] );
            fvalue.push( pFields[rind][0] );
        }
        if(fname.indexOf("DATE_EDIT") == -1)
        {  
            fname.push("DATE_EDIT");
            fvalue.push( a.valueof("$sys.date") );
        }
        if(fname.indexOf("USER_EDIT") == -1)
        {    
            fname.push("USER_EDIT");
            fvalue.push( a.valueof("$sys.user") );	
        }	
        updanz = a.sqlUpdate( pTable, fname,  a.getColumnTypes(pTable, fname), fvalue, pIDField + " = '" + pValues[0] + "'");
    }
    return updanz;
}

/*
* setzt eine laufende Nr für Tabelle ab Version 3.1.
*
* @param {[]} pTable req Tabellenname
* @param {[]} pIndex req Spalte für den Zählwert
* @param {Integer} pStart opt
*
* @return {void}
*/
function setTableIndex(pTable, pIndex, pStart)
{
    if ( pStart == undefined ) pStart = 1;
    var id = a.decodeFirst(a.valueof(pTable) );
    if (id != '')
    {
        var data = a.getTableData(pTable, [id]);
        if (data[0][pIndex] == null)	
        {
            var alldata = a.getTableData(pTable,a.ALL);
            var maxid = pStart;
            for ( var i =0; i < alldata.length; i++ )
            {
                if ( alldata[i][pIndex] >= maxid && alldata[i][pIndex] != null )  maxid = eMath.addInt(alldata[i][pIndex], 1);
            }
            a.updateTableCell(pTable, id, pIndex, maxid, maxid);
        }
    }
}