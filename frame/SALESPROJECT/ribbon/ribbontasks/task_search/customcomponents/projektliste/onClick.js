import("lib_keyword");
import("lib_sql");
import("lib_attr");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

// users mit der Rolle Salesproject 
var users = tools.getUsersWithRole("PROJECT_Projekt");

var data = a.sql("select SALESPROJECTID, PROJECTNUMBER, PROJECTTITLE, (select ORGNAME from ORG join RELATION on ORGID = ORG_ID where RELATIONID = SALESPROJECT.RELATION_ID), " 
	+ getKeySQL("SPSTATUS", "STATUS") + ", " + getKeySQL("SPPHASE", "PHASE") + " , cast(VOLUME as integer), "
	+ " (select max(" + concat(["FIRSTNAME", "LASTNAME"]) + ") from SPMEMBER join RELATION on RELATIONID = SPMEMBER.RELATION_ID "
	+ " join pers on persid = relation.pers_id "
	+ " where SPMEMBER.SALESPROJECT_ID = SALESPROJECT.SALESPROJECTID and SALESPROJECTROLE = 1) "
        + ", INFO from SALESPROJECT where " + a.valueof("$sys.selection") + " order by STATUS desc", a.SQL_COMPLETE);

var rptfields = ["SALESPROJECTID", "PROJECTNUMBER", "PROJECTTITLE", "COMPANY", "STATUS", "PHASE", "VOLUME", "PROJECTMANAGER", "INFO"];

a.openStaticLinkedReport("RPTJ_SALESPROJECTLIST", false, a.REPORT_OPEN, null, params, rptfields, data );