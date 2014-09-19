var error = false;

var anz = a.sql("select count(*) from address where relation_id not in (select relationid from relation)");
var message = anz + " Fehler in Address(RELATIONID)\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from address where addressid not in (select address_id from relation)");
message += anz + " Fehler in Address(ADDRESSID)\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from relation where pers_id not in (select persid from pers) and pers_id is not null");
message += anz + " Fehler in RELATION für Pers\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from relation where address_id not in (select addressid from address) or address_id is null");
message += anz + " Fehler in RELATION für Address\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from relation where org_id not in (select  orgid from org)");
message += anz + " Fehler in RELATION für ORG\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from pers where persid not in (select pers_id from relation where pers_id is not null)");
message += anz + " Fehler in PERS\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from ORG where ORGID not in (select org_id from relation) and ORGID <> '0'");
message += anz + " Fehler in ORG\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from HISTORYLINK where HISTORY_ID not in (select HISTORYID from HISTORY)");
message += anz + " Fehler in HISTORYLINK\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from HISTORY_THEME where HISTORY_ID not in (select HISTORYID from HISTORY)");
message += anz + " Fehler in HISTORY_THEME\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from COMM where RELATION_ID not in (select RELATIONID from RELATION)");
message += anz + " Fehler in COMM\n";
if ( anz > 0 ) error = true;
anz = a.sql("select count(*) from ATTRLINK where OBJECT_ID in ( 1, 2) and ROW_ID not in (select RELATIONID from RELATION)");
message += anz  + " Fehler in ATTRLINK\n";
if ( anz > 0 ) error = true;

a.showMessage(message);
if ( error && a.askQuestion(a.translate("Sollen die falschen Datensätze gelöscht werden ?"), a.QUESTION_YESNO, "") == "true" )
{
    a.sql("delete from relation where pers_id not in (select persid from pers) and pers_id is not null");
    a.sql("delete from relation  where address_id not in (select addressid from address) or address_id is null");
    a.sql("delete from relation where org_id not in (select  orgid from org)");
    a.sql("delete from address where relation_id not in (select relationid from relation)");
    a.sql("delete from address where addressid not in (select address_id from relation)");
    a.sql("delete from pers where persid not in (select pers_id from relation where pers_id is not null)");
    a.sql("delete from ORG where ORGID not in (select org_id from relation) and ORGID <> '0'") ;
    a.sql("delete from HISTORYLINK where HISTORY_ID not in (select HISTORYID from HISTORY)");
    a.sql("delete from HISTORY_THEME where HISTORY_ID not in (select HISTORYID from HISTORY)");
    a.sql("delete from COMM where RELATION_ID not in (select RELATIONID from RELATION)");
    a.sql("delete from ATTRLINK where OBJECT_ID in ( 1, 2) and ROW_ID not in (select RELATIONID from RELATION)");
}