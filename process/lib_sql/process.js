import("lib_util")

/*
* Maskiert die Funktion cast.
*
* @param {String} pField req das Feld
* @param {String} pDatatype req der Datentyp in den gecastet werden soll ( varchar, integer, char )
* @param {Integer} pLength req die Länge für den Datentyp
* @param {String} pAlias req Der Datenbank-Alias
*
* @return {String} (Teil einer SQL-Anweisung)
*/
function cast(pField, pDatatype, pLength, pAlias)
{
    if (pAlias == undefined) pAlias = a.valueof("$sys.dbalias");
    var dbtype = a.getDatabaseType(pAlias);
    var func = "";
    var datatype = "";
	
    switch (Number(dbtype))
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
            func = "cast";
            switch (pDatatype)
            {
                case "char":
                case "varchar":
                    datatype = "varchar2";
                    break;
                case "integer":
                    datatype = "number(22,0)";
                    break;
            }
            break;
        case a.DBTYPE_POSTGRESQL8:
            func = "cast";
            switch (pDatatype)
            {
                case "char":
                case "varchar":
                    datatype = "varchar";
                    break;
                case "integer":
                    datatype = "numeric(22,0)";
                    break;
            }
            break;
        case a.DBTYPE_SQLSERVER2000:
            func = "cast";
            switch (pDatatype)
            {
                case "char":
                case "varchar":
                    datatype = "varchar";
                    break;
                case "integer":
                    datatype = "int";
                    break;
            }
            break;
        case a.DBTYPE_MYSQL4:
            func = "cast";
            switch (pDatatype)
            {
                case "char":
                case "varchar":
                    datatype = "char";
                    break;
                case "integer":
                    datatype = "integer";
                    break;
            }
            break;
        case a.DBTYPE_DERBY10:
            func = "cast";
            if (pLength > 254) pLength = 254;
            switch (pDatatype)
            {
                case "varchar":
                case "char":
                    datatype = "char";
                    func = "rtrim(" + func;
                    pLength += ")"; 
                    break;
                case "integer":
                    datatype = "number(22,0)";
                    break;
            }
            break;
        case a.DBTYPE_INTERBASE7:
            func = "cast";
            switch (pDatatype)
            {
                case "char":
                case "varchar":
                    datatype = "varchar";
                    break;
                case "integer":
                    datatype = "numeric(22,0)";
                    break;
            }
            break;
    }
	
    if (pLength != "")
    {
        pLength = "(" + pLength + ")"
    }
    else
    {
        pLength = "(100)"
    }
    return func + "(" + pField + " as " + datatype + pLength + ")";
}

/*
* Maskiert die Funktion substring.
*
* @param {String }pExpression req
* @param {Integer} pStart req Stelle für den Anfang
* @param {String} pAlias req Der Datenbank-Alias
* @param {Integer} pLength req Länge
*
* @return {String}
*/

function substring(pExpression, pStart, pLength, pAlias)
{
    if ( pLength == undefined ) pLength = 100;
    if ( pAlias == undefined ) pAlias = a.valueof("$sys.dbalias"); 
    var dbtype = a.getDatabaseType(pAlias);
    var string = "";
	
    switch (Number(dbtype))
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
            string = "substr";
            break;
        case a.DBTYPE_DERBY10:
            string = "substr";
            break;
        case a.DBTYPE_POSTGRESQL8:
            string = "substr";
            break;
        case a.DBTYPE_SQLSERVER2000:
            string = "substring";
            break;
        case a.DBTYPE_MYSQL4:
            string = "substring";
            break;
    }
	
    return string + "(" + pExpression + ", " + pStart + ", " + pLength + ")";
}
/*
* Maskiert die Funktion top.
*
* @param {String} pSelect req Select-Anweisung
* @param {String} pAlias req Der Datenbank-Alias
* @param {Integer} pTopCount req Anzahl der anzuzeigenden Datensätze
*
* @return {String} der zusammengebaute SQL-Befehl
*/
function top( pTopCount, pSelect, pAlias )
{
    if ( pAlias == undefined ) pAlias = a.valueof("$sys.dbalias");
    var dbtype = a.getDatabaseType(pAlias);
    var query = pSelect;
	
    switch (Number(dbtype))
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
            if (query.search("where") == -1)
            {
                query = query + " where rownum < " + pTopCount;
            }
            else
            {
                query = query + " and rownum < " + pTopCount;
            }
            break;
        case a.DBTYPE_SQLSERVER2000:
            query = query.replace(/select/, "select top " + pTopCount);
            break;			
    }
	
    return query;
}

/*
* Maskiert die Funktion concat.
*
* @param {[]} pFields req Felder die concateniert werden sollen
* @param {String} pSeparator opt Trennzeichen keine Angabe Leerzeichen
* @param {String} pAlias opt Der Datenbank-Alias
*
* @return {String} SQL-Befehl
*/
function concat(pFields, pSeparator, pAlias)
{
    var i;
    if ( pAlias == undefined || pAlias == "" )  pAlias =  a.valueof("$sys.dbalias");
    var dbtype = a.getDatabaseType(pAlias);
    var concat_string = " || ";
    var retstr = "";
    var blank = "''";
    var isempty =  " != '' ";
    if ( pSeparator == undefined ) pSeparator = " ";

    switch (Number(dbtype))
    {
        case a.DBTYPE_MYSQL4:
            retstr = " concat_ws( '" + pSeparator + "'";
            for (i=0; i<pFields.length; i++)
            {
                retstr += ", " + pFields[i];
            }
            return retstr + ") ";
            break;
	 
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
            blank = "trim('')";
            isempty = " is not null ";
            break;

        case a.DBTYPE_SQLSERVER2000:
            concat_string = " + ";
            break;
    }		
    pSeparator = concat_string + "'" + pSeparator + "'";
    for (i = 0; i < pFields.length; i++)
    {
        if (retstr != "")  retstr += concat_string;
        if ( i < pFields.length - 1 )
            retstr += " case when " + pFields[i] + isempty + " then " + pFields[i] + pSeparator + " else " + blank + " end ";
        else 
            retstr += " case when " + pFields[i] + isempty + " then " + pFields[i] + " else " + blank + " end ";
    }
    return retstr;
}

/*
* Baut aus mehreren Conditions eine einzige Condition.
*
* @param {[]} pArray req das Array mit den Conditions
* @param {String} pOperator req der Operator, mit dem die Conditions verbunden werden sollen (AND/OR)
*
* @return {String} die verbundene Condition
*/
function concatConditions(pArray, pOperator)
{
    var result = "";
	
    for (var i = 0; i < pArray.length; i++)
    {
        if (pArray[i] != null && pArray[i] != '')
        {
            if (result.length > 0)
                result += (" " + pOperator + " ");			
			
            result += pArray[i];											
        }
    }
	
    return result;
}
/*
* Überprüft ob neuer Eintrag schon existiert.
* 
* @param {String} pTable req die Tabelle in der Daten eingefügt werden sollen (z.B. "comm")
* @param {[]} pColumns req die Spalten, die eingefügt werden wie für sqlInsert
* @param {[]} pTypes req die Datentypen, die eingefügt werden wie für sqlInsert
* @param {[]} pValues req die Werte, die eingefügt werden wie für sqlInsert
* @param {[]} pExcludeFields opt die Spalten, die nicht geprüft werden sollen
* 
* @return {anzahl}
*/
function isDuplicat(pTable, pColumns, pTypes, pValues, pExcludeFields)
{
    var col = new Array();
    var typ = new Array();
    var val = new Array();
    var excludefields = ["DATE_NEW" ,"DATE_EDIT" ,"USER_NEW" ,"USER_EDIT", "KEYVALUE",  "KEYSORT", pTable.toUpperCase() + "ID"];
    if ( pExcludeFields != undefined ) excludefields = excludefields.concat(pExcludeFields); 				
		
    for ( var i = 0; i < 	pColumns.length; i++ )		
    {
        if ( !hasElement( excludefields, pColumns[i], true ) && pValues[i] != "" && pTypes[i] != SQLTYPES.LONGVARCHAR && pTypes[i] != SQLTYPES.CLOB)
        {
            col.push( pColumns[i] ); 
            typ.push( pTypes[i] );
            val.push( pValues[i] );
        }
    }
    var count =  a.getRowCount( pTable, col, typ, val );
    return count;
}

/*
* Gibt Condition für Datum zurück.
*
* @param {String} pColumn req Spaltenname
* @param {String} pOperator req 
* @param {Long} pValue req Longwert des Datums
* @param {String} pAlias req Datenbankalias
*
* @return {String} condition
*/

function getTimeCondition(pColumn, pOperator, pValue,  pAlias)
{
    if ( pAlias == undefined )  pAlias = a.valueof("$sys.dbalias");
    var pDatabaseType = a.getDatabaseType(pAlias)

    var cond = "";
    var ds = date.longToDate(pValue, "yyyy-MM-dd HH:mm:ss");
    switch(Number(pDatabaseType))
    {
        case a.DBTYPE_SQLSERVER2000 :
            cond = pColumn + " " + pOperator + " convert(datetime, '" + ds + "', 120)";
            break;
        case a.DBTYPE_INTERBASE7 :
            cond = pColumn + " " + pOperator + " '" + ds + "'";
            break;
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_OCI:
        case a.DBTYPE_ORACLE10_THIN :
            cond = pColumn + pOperator + "to_date('" + ds + "', 'YYYY-MM-DD HH24:MI:SS')";   
            break;
        default:
            cond = pColumn + " " + pOperator + " '" + ds + "'"; 
            break;
    }
	
    return cond;
}

/*
* trimfunktion
* 
* @param {String} pField Name des Feldes das gekürzt werden soll.
* 
* @return {String} Aufruf der Trim-Funktion als String
*/

function trim( pField )
{
    var dbtype = a.getDatabaseType(a.valueof("$sys.dbalias"));
    var string

    switch (Number(dbtype))
    {
        case a.DBTYPE_SQLSERVER2000:
            string = "ltrim(rtrim(" + pField + "))";
            break;
        default:
            string = "trim(" + pField + ")"
            break;
    }	
    return string;
}

/*
* Holt sich den Tag eines Datums
* 
* @param {Datetime} pDate req Datum, aus dem das Monat angezeigt wird
*
* @return {String} DAY(DATE) oder EXTRACT(DAY FROM DATE)
*/
function dayfromdate(pDate)
{
    var dbtype = a.getDatabaseType(a.valueof("$sys.dbalias"));
    var string = "";
	
    switch (Number(dbtype))
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
            string = "to_char(" + pDate + ",'dd')";
            break;
        case a.DBTYPE_DERBY10:
        case a.DBTYPE_SQLSERVER2000:
        case a.DBTYPE_MYSQL4:
            string = "DAY(" + pDate + ")";
            break;
        case a.DBTYPE_POSTGRESQL8:
        case a.DBTYPE_INTERBASE7:
            string = "EXTRACT (DAY FROM " + pDate + ")";
            break;
    }	
    return string;
}
/*
* Holt sich nur den Monat eines Datums
*
* @param {Datetime} pDate req Datum, aus dem das Monat angezeigt wird
*
* @return {String} MONTH(DATE) oder EXTRACT(MONTH FROM DATE)
*/
function monthfromdate(pDate)
{
    var dbtype = a.getDatabaseType(a.valueof("$sys.dbalias"));
    var string = "";
	
    switch (Number(dbtype))
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
            string = "to_char(" + pDate + ",'MM')";
            break;
        case a.DBTYPE_DERBY10:
        case a.DBTYPE_SQLSERVER2000:
        case a.DBTYPE_MYSQL4:
            string = "MONTH(" + pDate + ")";
            break;
        case a.DBTYPE_POSTGRESQL8:
        case a.DBTYPE_INTERBASE7:
            string = "EXTRACT (MONTH FROM " + pDate + ")";
            break;
    }	
    return string;
}

/*
* Holt sich das Jahr eines Datums
*
* @param {Datetime} pDate req Datum, aus dem das Jahr angezeigt wird
*
* @return {String} YEAR(DATE) oder EXTRACT(YEAR FROM DATE)
*/
function yearfromdate(pDate)
{
    var dbtype = a.getDatabaseType(a.valueof("$sys.dbalias"));
    var string = "";
	
    switch (Number(dbtype))
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
            string = "to_char(" + pDate + ",'yyyy')";
            break;
        case a.DBTYPE_DERBY10:
        case a.DBTYPE_SQLSERVER2000:
        case a.DBTYPE_MYSQL4:
            string = "YEAR(" + pDate + ")";
            break;
        case a.DBTYPE_POSTGRESQL8:
        case a.DBTYPE_INTERBASE7:
            string = "EXTRACT (YEAR FROM " + pDate + ")";
            break;
    }	
    return string;
}

/*
* gibt das aktuelle Datum in SQL-Abfragen zurück
*
* @return {String}expression
*/
function currentDate()
{
    var dbtype = a.getDatabaseType(a.valueof("$sys.dbalias"));
    var expression = "";
	
    switch (Number(dbtype))
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
        case a.DBTYPE_DERBY10:
            expression = "CURRENT_DATE";
            break;
        case a.DBTYPE_SQLSERVER2000:
            expression = "GETDATE()";
            break;
    }	
    return expression;
}

/*
* liefert den aktuellen Suchstring inkl. Platzhalter
*
* @param {String} pfield req (den Suchfeld)
* @param {String} pfind req (den Suchstring)
* @param {String} pIgnoreCase opt (true/false)
* @param {String} pPlaceHolder opt (Platzhalter Einstellung)
*
* @return {String} (den Suchstring mit Platzhalter)
*/
function getPlaceHolderCondition( pfield, pfind, pIgnoreCase, pPlaceHolder )
{
    var user = tools.getUser(a.valueof("$sys.user"));
    var IgCa;
    var PlHo;
		
    //wenn optoinal IgnoreCase und PlaceHolder vorhanden, dann diese verwenden
    if(pIgnoreCase != undefined)
        IgCa = pIgnoreCase;
    else
        IgCa = user[tools.PARAMS][tools.SELECTION_IGNORECASE];
			
    if(pPlaceHolder != undefined) 
        PlHo = pPlaceHolder;
    else
        PlHo = user[tools.PARAMS][tools.SELECTION_PLACEHOLDER];

    if ( pfind )
    {
        pfind = pfind.replace( new RegExp("\\'", "g"), "''");
        pfind = pfind.replace( new RegExp("\\*", "g"), "%");
        var ic = (IgCa == "true" ? "UPPER" : "");
        var cond = "";
        switch( PlHo )
        {
            case "1":
                cond = ic + "(" + pfield + ") like " + ic + "('" + pfind + "%')";
                break;
            case "2":
                cond = ic + "(" + pfield + ") like " + ic + "('%" + pfind + "')";
                break;
            case "3":
                cond = ic + "(" + pfield + ") like " + ic + "('%" + pfind + "%')";
                break;
            case "4":				
                cond = ic + "(" + pfield + ") like " + ic + "('" + pfind + "')";
                break;
            default:
                cond = ic + "(" + pfield + ") = " + ic + "('" + pfind + "')";
                break;
        }
    }
    return cond;
}

/*
* Gibt SQLSystax für ein Datum zurück.
* 
* @param {String} pColumn req Spaltenname
* @param {String} pAlias req Datenbankalias
*
*@return {String} sqlstr
*/

function getSQLFormatedDate(pColumn, pAlias)
{
    if ( pAlias == undefined )  pAlias = a.valueof("$sys.dbalias");
    var pDatabaseType = a.getDatabaseType(pAlias)
    var concatstr = " || ";
    switch(Number(pDatabaseType))
    {
        case a.DBTYPE_SQLSERVER2000:
            concatstr = " + ";
            day = "cast(day(" + pColumn + ") as char(2))"
            month = "cast(month(" + pColumn + ") as char(2))"
            year = "cast(year(" + pColumn + ") as char(4))"
            str = day + concatstr + "'.'" + concatstr + month + concatstr + "'.'" + concatstr + year;
            break;		
        case a.DBTYPE_POSTGRESQL8:
            day = "extract(day from " + pColumn + ")";
            month = "extract(month from " + pColumn + ")";
            year = "extract(year from " + pColumn + ")";
            str = day + concatstr + "'.'" + concatstr + month + concatstr + "'.'" + concatstr + year;
            break;
        case a.DBTYPE_DERBY10:
        case a.DBTYPE_MYSQL4:
            day = "trim(cast(day(" + pColumn + ") as char(2)))"
            month = "trim(cast(month(" + pColumn + ") as char(2)))"
            year = "trim(cast(year(" + pColumn + ") as char(4)))"
            str = day + concatstr + "'.'" + concatstr + month + concatstr + "'.'" + concatstr + year;
            break;		
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_OCI:
        case a.DBTYPE_ORACLE10_THIN :
            str = "to_char(" + pColumn + ", 'DD.MM.YYYY') ";   
            break;
        default:
            str = "cast(" + pColumn + " as varchar (10))"; 
            break;
    }	
    return str;
}

/*
* Gibt den SQL Operator eines integer Wertes (z.B. $local.operator) zurück
*
* @param {int} pVal
*
* @return {string}
*/
function getSQLOperator(pVal)
{
    var retval = "";
    switch(Number(pVal))
    {
        case 1:
            retval = "=";
            break; //gleich
        case 2:
            retval = "<>";
            break; //ungleich
        case 3:
            retval = ">";
            break; //größer
        case 4:
            retval = "<";
            break; //kleiner
        case 5:
            retval = "<=";
            break; //kleiner gleich
        case 6:
            retval = ">=";
            break; //größer gleich
        case 7:
            retval = "like";
            break; //enthält, beginnt mit, endet mit
        case 8:
            retval = "not like";
            break; //enthält nicht
        case 9:
            retval = "";
            break;
        case 10:
            retval = "";
            break;
        case 11:
            retval = "is not null";
            break; 
        case 12:
            retval = "is null";
            break;
    }
    return retval;
}