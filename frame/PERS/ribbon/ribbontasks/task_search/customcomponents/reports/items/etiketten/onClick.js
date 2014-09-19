import("lib_report");

var columnNames = [ "ORGNAME", "DEPARTMENT", "COUNTRY", "ZIP", "CITY", "ADDRESS", "BUILDINGNO"];

var rptData = a.sql("select  " + columnNames.join(", ") + ", (" + concat(["salutation", "title", "firstname", "lastname"])
    + ") from RELATION join ORG on (ORGID = ORG_ID) join PERS on (PERSID = PERS_ID) join ADDRESS on ADDRESSID = ADDRESS_ID"
    + " where " + a.valueof("$sys.selection") + " order by lastname", a.SQL_COMPLETE);

columnNames.push("NAME");

a.openStaticLinkedReport("RPTJ_ETIKETTEN", false, a.REPORT_OPEN, null, null, columnNames, rptData);
