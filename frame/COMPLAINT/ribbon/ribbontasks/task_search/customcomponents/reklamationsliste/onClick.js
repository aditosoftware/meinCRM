import("lib_keyword");
import("lib_sql");
import("lib_attr");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

var data = a.sql("select COMPLAINTID, COMPLAINTNUMBER, "
	+ " (select ORGNAME from ORG join relation on (orgid = org_id) where relationid = COMPLAINT.RELATION_ID), "
	+ " (select " + concat(["firstname", "lastname"]) 
	+ " from pers join relation on (persid = pers_id) where relationid = COMPLAINT.RESPONSIBLE_ID), "
	+ getKeySQL("COMPLAINTCATEGORY","CATEGORY") + ", " + getKeySQL("COMPLAINTSTATUS","STATUS") + ", "
	+ getKeySQL("GroupCode","GROUPCODEID") + ", (select PRODUCTNAME from PRODUCT join MACHINE on PRODUCTID = PRODUCT_ID where MACHINEID = COMPLAINT.MACHINE_ID), "
	+ getAttrSQL("Schadensart", "COMPLAINTID") + ", SUBJECT, DESCRIPTION "
	+ " from COMPLAINT where " + a.valueof("$sys.selection") + " order by STATUS", a.SQL_COMPLETE);

var rptfields = ["COMPLAINTID", "COMPLAINTNUMBER", "COMPANY", "RESPONSIBLE", "CATEGORY", "STATUS", "GROUPCODE", "PRODUCT", 
	"DAMAGE", "SUBJECT", "DESCRIPTION"]

a.openStaticLinkedReport("RPTJ_COMPLAINTLIST", false, a.REPORT_OPEN, null, params, rptfields, data );