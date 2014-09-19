import("lib_report");

var orgid = a.valueof("$comp.orgid");

var params = orgreport(a.valueof("$sys.clientid"), a.valueof("$comp.relationid"), orgid);
a.openStaticLinkedReport("RPTJ_ORG", false, a.REPORT_OPEN, null, params, null, null);