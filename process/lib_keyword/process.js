/*
* Liefert einen SQL zurück, der den Keytype anhand des Keyname2 ausgibt.
*
* @param {String} pKeyName2 req Keyname2
*
* @return  {String} SQL der den KeyType ausgibt
*/

function getKeyTypeSQL(pKeyName2)
{
    if ( typeof(pKeyName2) == "object") pKeyName2 = pKeyName2.join("', '")
    return " keyword.keytype in ( select keyvalue from keyword where keyname2 in ('" + pKeyName2 + "') and keytype = 0 ) and keyword.aoactive = 1 "
}

/*
* liefert eine sortierte und übersetzte Liste der Werte für einen Schlüsseltyp 
* 
* @param {String} pKeyname2 req der Keyname2 mit dem internen Schlüsselwortnamen
* @param {Bool} pNameOnly opt falls false oder undefined wird (keyvalue, keyname) geliefert, sonst nur (keyname)
* 
* @return {[]} aus (keyvalue, keyname) oder (keyname), je nach Wert von pNameOnly
*/
function getValueList(pKeyname2, pNameOnly)
{
    var fields = ["KEYNAME1"];
    var index = 0;
    if(pNameOnly == undefined || pNameOnly == false || pNameOnly == "false") 
    {
        index = 1;
        fields = ["KEYVALUE", "KEYNAME1"];
    }
    return getKeyList( pKeyname2, fields, index );
}

/*
* liefert eine sortierte und übersetzte Liste der Werte für einen Schlüsseltyp 
*
* @param {String} pKey req der Keyname2 mit dem internen Schlüsselwortnamen
* @param {String []} pFieldsName req die zu lieferten Datensplaten
* @param {Integer} pTranslate opt index der zu übersetzende Spalte
* @param {Integer} pCondition opt Condition
*
* @return {[]}
*/
function getKeyList( pKey, pFieldsName, pTranslate, pCondition )
{
    var condition = " and aoactive = 1 ";
    if ( a.hasvar("$sys.workingmode") && a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW )	condition = "";
    var sql = "select " + pFieldsName.join(", ") + " from keyword ";
    sql += " where keytype = (select keyvalue from keyword where keytype = 0 and upper(keyname2) = upper('" + pKey + "') ) " + condition;
    if ( pCondition != undefined && pCondition != "" ) sql += " and " + pCondition;
    sql += " order by keysort, keyname1 ";
    var data = a.sql(sql, a.SQL_COMPLETE);
    if ( pTranslate > -1 )	for(var i=0; i < data.length; i++)		data[i][pTranslate] = a.translate(data[i][pTranslate]);
    return data;
}

/*
* liefert den übersetzten Namen für einen Schlüsselwert 
* 
* @param {Number} pValue req der KeyValue
* @param {String} pKeyname2 req der Keyname2 mit dem internen Schlüsselwortnamen
* @param {String} pKeyname1or2 opt der Keyname1 oder Keyname2
* @param {Number} pLanguage opt Sprache
* 
* @return {String} mit dem Namen 
*/
function getKeyName(pValue, pKeyname2, pKeyname1or2, pLanguage)
{
    if ( pValue == "" )   return "";
    if (pKeyname1or2 == undefined) pKeyname1or2 = "keyname1";
    var sql = " select " + pKeyname1or2 + " from keyword " + 
    " where keyvalue = " + pValue + " and keytype = " + 
    " (select keyvalue from keyword where keytype = 0 and upper(keyname2) = upper('" + pKeyname2 + "') ) and aoactive = 1 ";
    var res = a.sql(sql);
    if (pLanguage == undefined) res = a.translate(res);
    else	res = a.translate(res, pLanguage);
    return res;
}

/*
* Liefert einen SubSQL zurück, der den Keyname auflöst.
* 
* @param {String} pKeyName req Keyname
* @param {String} pValueFieldName req Name der Feldes
* @param {String} pLang opt Sprache
* 
* @return  {String} SubSQLString der KeyName auflöst
*/

function getKeySQL( pKeyName, pValueFieldName, pLang )
{
    var sqlstr = "''";
    var keylist = a.sql("select KEYVALUE, KEYNAME1, KEYNAME2 from KEYWORD where KEYTYPE = ( select KEYVALUE from KEYWORD where KEYNAME2 = '" 
        + pKeyName + "' and keytype = 0 )", a.SQL_COMPLETE);
    if ( keylist.length > 0 )
    {
        sqlstr = " case"
        for ( var i = 0; i < keylist.length; i++ )
        {
            var translate =(pLang == undefined)? a.translate( keylist[i][1] ) : a.translate( keylist[i][1], pLang );
            sqlstr += " when " + pValueFieldName + " = " + keylist[i][0] + " then '" 
            + translate.replace(new RegExp("'","g"), "''") + "'";
        }
        sqlstr += " else '' end ";
    }		
    return sqlstr;												
}

/*
* Liefert den Keyvalue eines Keywords zurück
*
* @param {String} pKeyName1 req KeyName1 z.B. 'Besuch'
* @param {String} pKeyTypeName req KeyName2 z.B. 'HistoryMedium'
*
* @return  {String} SubSQLString der den KeyValue zurückgibt
*/

function getKeyValue( pKeyName1, pKeyTypeName )
{
    return a.sql("select KEYVALUE from KEYWORD where " + getKeyTypeSQL(pKeyTypeName) + " and KEYNAME1 = '" + pKeyName1 + "'");
}

/*
* Liefert CommAddresse zurück
*
* @param {String} pType req pType ( Pers oder Org )
* @param {String} pMedium req pMedium z.B. 'Telefon Büro'
* @param {String} pRelIDFieldName req Feldname der RelationID z.B. 'RELATIONID'
*
* @return  {String} SubSQLString der die COMMAddr zurückgibt
*/

function getCommAddrSQL( pType, pMedium, pRelIDFieldName )
{
    var retstr = "''"
    var keyvalue = getKeyValue( pMedium, pType + "Medium" );
	
    if ( keyvalue != "" ) retstr = "( select max(ADDR) from COMM where MEDIUM_ID = " + keyvalue + " and RELATION_ID = " + pRelIDFieldName + ")";
    return retstr;
}

/*
* Liefert StandardCommAddresse zurück
*
* @param {String} pType req pType ( Pers oder Org )
* @param {String} pMedium req pMedium z.B. mail fon fax
* @param {String} pRelIDFieldName req Feldname der RelationID z.B. 'RELATIONID'
*
* @return  {String} SubSQLString der die COMMAddr zurückgibt
*/

function getCommStandardAddrSQL( pType, pMedium, pRelIDFieldName )
{
    var retstr = "( select max(ADDR) from COMM where MEDIUM_ID in (select KEYVALUE from KEYWORD where " 
    + getKeyTypeSQL( pType + "Medium" ) + " and KEYNAME2 = '" + pMedium + "')"
    + " and STANDARD = 1 and COMM.RELATION_ID = " + pRelIDFieldName + ")";
    return retstr;
}