import("lib_duplicate");

var user = a.valueof("$sys.user");
var sysdate = a.valueof("$sys.date");
var param = []; 
var gesamtanz = a.sql("select count(*) from ORG where ORGID != '0'");
var count = 0;
var addressdata = [];
var commdata = [];
var fielddata = [];
var fields = ["OBJECT_ID", "ROW_IDS", "NUMBEROF", "INFO", "DATE_NEW", "USER_NEW"];
var types = a.getColumnTypes("DUPLICATE", fields);
var data = getKeyList( "DuplicateOrgPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
for ( i = 0; i < data.length; i++ ) param[data[i][0]] = data[i];

var sqlstr = "select RELATIONID, ORGNAME, ADDRESSID, CITY, ADDRESS, ZIP, COUNTRY, COMMID, KEYNAME2, ADDR from ORG join RELATION on ORGID = ORG_ID and PERS_ID is null "
    + " join ADDRESS on ADDRESS.RELATION_ID = RELATIONID left join COMM on COMM.RELATION_ID = RELATIONID "
    + " left join KEYWORD on MEDIUM_ID = KEYVALUE and KEYTYPE = 8 order by RELATIONID, ADDRESSID, COMMID";

if ( !a.hasvar("$sys.clientid") || a.askQuestion(a.translate("Sollen für %0 Firmen die Dublette neu berechnet werden?", [gesamtanz] ), a.QUESTION_YESNO, null ) == "true")
{
    data = a.sql( sqlstr, a.SQL_COMPLETE );
    a.sql("delete from DUPLICATE where OBJECT_ID = 1");
    var oldid = data[0][0];

    for ( var i = 0; i < data.length; i++)
    {
        if ( oldid != data[i][0] )
        {
            count += getDuplicate( makeDdata(fielddata, addressdata, commdata ), param, oldid, "ORG", "1" );
            oldid = data[i][0];
            addressdata = [];
            commdata = [];
            fielddata = [];
        }
        if ( fielddata[data[i][0]] == undefined )   fielddata[data[i][0]] = ["orgname", data[i][1]];
        if ( addressdata[data[i][2]] == undefined )   
            addressdata[data[i][2]] = ["address", [ ["address", data[i][4]], ["city", data[i][3]], ["zip", data[i][5]], ["country", data[i][6]]]];
        if ( commdata[data[i][5]] == undefined )   commdata[data[i][5]] = [ data[i][6], data[i][7] ];
    }
    count += getDuplicate( makeDdata(fielddata, addressdata, commdata ), param, oldid, "ORG", "1" );
    sqlstr = a.translate("%0 Dubletten in %1 Firmen gefunden.", [count, gesamtanz]);
    if ( a.hasvar("$sys.clientid") )    a.showMessage( sqlstr );
    else log.log( sqlstr );
}

function getDuplicate( pData, pParam, pID, pFrame, pFrameID )
{
    var count = 0;
    var pattern = getPattern( pData, pParam )
    var duplicates = a.indexSearch( pattern, false, [pFrame]);
    var result = duplicates["HITS"];
    if( result.length > 1 ) 
    {
        var rows = [];
        var info = "";
        for ( var z = 0; z < result.length && z < 20; z++ )
        {
            var relid = result[z]["#ADITO_SEARCH_ID"]
            var nodup = a.sql("select count(*) from NODUPLICATE where ( RELATION1_ID = '" + trim(pID) 
                + "' and RELATION2_ID = '" + trim(relid) + "') or ( RELATION2_ID = '" + trim(pID) 
                + "' and RELATION1_ID = '" + trim(relid) + "')");
            if ( nodup == 0 )
            {
                rows.push(relid);
                info += result[z]["#ADITO_SEARCH_TITLE"] + "\n" + result[z]["#ADITO_SEARCH_DESCRIPTION"] + "\n\n";
            }
        }
        if (rows.length > 1)
        {
            rowids = a.encodeMS(rows.sort());
            if ( a.sql("select count(*) from DUPLICATE where OBJECT_ID = 1 and ROW_IDS = '" + rowids + "'") == 0 )
            {
                count++;
                info += "\n\n" + pattern;
                a.sqlInsert("DUPLICATE", fields, types, [ pFrameID, rowids, rows.length, info, sysdate, user ]);        
            }
        }
    }
    return count;
}

function makeDdata( pFielddata, pAddressdata, pCommdata )
{
    var ddata = [];
    var commdata = [];
    for ( element in pFielddata )       ddata.push( pFielddata[element] );
    for ( element in pAddressdata )     ddata.push( pAddressdata[element] );
    for ( element in pCommdata )    commdata.push( pCommdata[element] );
    if ( commdata.length > 0 )      ddata.push(["comm", commdata]);
    return ddata;    
}