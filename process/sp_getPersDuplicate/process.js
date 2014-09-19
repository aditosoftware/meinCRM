import("lib_duplicate");

var user = a.valueof("$sys.user");
var sysdate = a.valueof("$sys.date");
var param = []; 
var gesamtanz = a.sql("select count(*) from PERS");
var count = 0;
var addressdata = [];
var commdata = [];
var fielddata = [];
var fields = ["OBJECT_ID", "ROW_IDS", "NUMBEROF", "INFO", "DATE_NEW", "USER_NEW"];
var types = a.getColumnTypes("DUPLICATE", fields);

var data = getKeyList( "DuplicatePersPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
for ( i = 0; i < data.length; i++ ) param[data[i][0]] = data[i];

var sqlstr = "select RELATIONID, PERSID, SALUTATION, LASTNAME, FIRSTNAME, ADDRESSID, CITY, ADDRESS, ZIP, COUNTRY, COMMID, KEYNAME2, ADDR from PERS join RELATION on PERS_ID = PERSID "
+ " join ADDRESS on ADDRESS_ID = ADDRESSID left join COMM on COMM.RELATION_ID = RELATIONID "
+ " left join KEYWORD on MEDIUM_ID = KEYVALUE and KEYTYPE = 7 order by PERSID, ADDRESSID, COMMID";
           
data = a.sql( sqlstr, a.SQL_COMPLETE );
if ( !a.hasvar("$sys.clientid") || a.askQuestion(a.translate("Sollen für %0 Personen die Dublette neu berechnet werden?", [gesamtanz] ), a.QUESTION_YESNO, null ) == "true")
{
    a.sql("delete from DUPLICATE where OBJECT_ID = 2");
    var oldid = data[0][1];

    for ( var i = 0; i < data.length; i++)
    {
        if ( oldid != data[i][1] )
        {
            count += getDuplicate( makeDdata(fielddata, addressdata, commdata ), param, oldid );
            oldid = data[i][1];
            addressdata = [];
            commdata = [];
            fielddata = [];
        }
        if ( fielddata[data[i][1]] == undefined )   fielddata[data[i][1]] = [["salutation", data[i][2]], ["lastname", data[i][3]], ["firstname", data[i][4]] ];
        if ( addressdata[data[i][5]] == undefined )   
            addressdata[data[i][5]] = ["address", [ ["address", data[i][7]], ["city", data[i][6]], ["zip", data[i][8]], ["country", data[i][9]]]];
        if ( commdata[data[i][8]] == undefined )   commdata[data[i][8]] = [ data[i][9], data[i][10] ];
    }
    count += getDuplicate( makeDdata(fielddata, addressdata, commdata ), param, oldid );
    sqlstr = a.translate("%0 Dubletten in %1 Personen gefunden.", [count, gesamtanz]);
    if ( a.hasvar("$sys.clientid") )    a.showMessage( sqlstr );
    else log.log( sqlstr );
}

function getDuplicate( pData, pParam, pPersID )
{
    var count = 0;
    var pattern = getPattern( pData, pParam )
    var duplicates = a.indexSearch( pattern, false, ["PERS"]);
    var result = duplicates["HITS"];
    if( result.length > 1 ) 
    {
        var rows = [];
        var info = "";
        for ( var z = 0; z < result.length && z < 20; z++ )
        {
            var relid = result[z]["#ADITO_SEARCH_ID"];
            var persid = a.sql("select PERS_ID from RELATION where RELATIONID = '" + relid + "'" )               
            var nodup = a.sql("select count(*) from NODUPLICATE where ( RELATION1_ID = '" + pPersID + "' and RELATION2_ID = '" 
                + persid + "') or ( RELATION2_ID = '" + pPersID + "' and RELATION1_ID = '" + persid + "')");

            // PERSID von  Dupletten
            if ( (persid != pPersID || z == 0) && nodup == 0 )
            {
                rows.push( relid );
                info += result[z]["#ADITO_SEARCH_TITLE"] + "\n" + result[z]["#ADITO_SEARCH_DESCRIPTION"] + "\n\n";
            }
        }
        if (rows.length > 1)
        {
            rowids = a.encodeMS(rows.sort());
            if ( a.sql("select count(*) from DUPLICATE where OBJECT_ID = 2 and ROW_IDS = '" + rowids + "%'") == 0 )
            {
                count++;
                info += "\n\n" + pattern;
                a.sqlInsert("DUPLICATE", fields, types, [ "2", rowids, rows.length, info, sysdate, user ]); 
            }
        }
    }
    return count;
}

function makeDdata( pFielddata, pAddressdata, pCommdata )
{
    var ddata = [];
    var cdata = [];
    for ( element in pFielddata )
    {
        for ( var z = 0; z < pFielddata[element].length; z++)
        {
            ddata.push( pFielddata[element][z] );
        }
    }
    for ( element in pAddressdata )     ddata.push( pAddressdata[element] );
    for ( element in pCommdata )    cdata.push( pCommdata[element] );

    if ( cdata.length > 0 )      ddata.push(["comm", cdata]);
    return ddata;    
}