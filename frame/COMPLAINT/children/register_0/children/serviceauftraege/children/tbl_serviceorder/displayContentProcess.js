import("lib_keyword")

var id = a.valueof("$comp.MACHINE_ID");

if (id != '')
    a.rq("select SERVICEORDERID, DATE_NEW, SERVICEORDERCODE, " + getKeySQL("SERVICESTATUS", "SERVICESTATUS") + ", "
        + getKeySQL("SERVICETYPE", "SERVICETYPE") + ", SERVICEINFO from SERVICEORDER where MACHINE_ID = '" + id + "'");