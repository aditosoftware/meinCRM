import("lib_keyword");
import("lib_sql");
import("lib_attr");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

var data = a.sql("select HISTORYID, ENTRYDATE, " + getKeySQL("HistoryMedium", "MEDIUM") 
    + ", DIRECTION, (select " + concat([cast("firstname", "char", 1), "'.'", "lastname"]) + " from pers join relation on (persid = pers_id) "
    + " where relationid = HISTORY.RELATION_ID), SUBJECT, cast(INFO as varchar(200)), "
    + " (select max(orgname) from org join relation on orgid = org_id join historylink on (row_id = relationid)"
    + " where OBJECT_ID = 1 and HISTORYLINK.HISTORY_ID = HISTORY.HISTORYID) "
    + " from HISTORY where " + a.valueof("$sys.selection") + " order by ENTRYDATE desc", a.SQL_COMPLETE);

for (i=0; i<data.length; i++)	data[i][1] = date.longToDate(data[i][1], "dd.MM.yyyy")

var rptfields = ["HISTORYID", "ENTRYDATE", "MEDIUM", "DIRECTION", "FIRSTLASTNAME", "SUBJECT", "INFO", "ORGNAME"];

a.openStaticLinkedReport("RPTJ_HISTORYLIST", false, a.REPORT_OPEN, null, params, rptfields, data );