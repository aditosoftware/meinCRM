import("lib_keyword")

var id = a.valueof("$comp.idcolumn");

if (id != '')
    a.rq("select SERVICEORDERID, DATE_NEW, SERVICEORDERCODE, " + getKeySQL("SERVICESTATUS", "SERVICESTATUS") + ", "
        + getKeySQL("SERVICETYPE", "SERVICETYPE") + ", SERVICEINFO from SERVICEORDER where MACHINE_ID = '" + id + "'");