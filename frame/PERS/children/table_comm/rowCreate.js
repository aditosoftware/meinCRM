import("lib_telephony");

var row = a.valueofObj("$local.rowdata");
var medium = row[2];
var adresse = row[3];

if ( medium != "" && medium != null && adresse != "" && adresse != null)
{
    var relationid = a.valueof("$comp.relationid");
    var searchaddr = getSearchAddr(medium, adresse);
    var slqstr = " KEYTYPE = ( select KEYVALUE from KEYWORD where KEYNAME2 = 'PersMedium' and keytype = 0 )"
    var subsql = " select KEYVALUE from KEYWORD where KEYNAME2 = ( select KEYNAME2 from KEYWORD where " + slqstr
    + " and KEYVALUE = " + medium + " ) and " + slqstr ;
    var standard = a.sql("select count(*) from COMM where RELATION_ID = '" + relationid + "' and MEDIUM_ID in (" + subsql + ")" );
    if ( standard == 0 ) standard = 1;	else standard = 0;
    var spalten = new Array("COMMID", "RELATION_ID", "MEDIUM_ID", "ADDR", "SEARCHADDR", "STANDARD", "DATE_NEW", "USER_NEW");
    var werte = new Array(a.getNewUUID(), relationid, medium, adresse, searchaddr, standard, a.valueof("$sys.date"), a.valueof("$sys.user"));
    a.sqlInsert("COMM", spalten, a.getColumnTypes("COMM", spalten), werte);
}