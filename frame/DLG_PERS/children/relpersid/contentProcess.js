import("lib_sql")

a.rq("select relationid, " + concat(["firstname", "lastname"]) + " from relation join pers on (persid = pers_id) "
    + "where status = 1 and org_id = '" + a.valueof("$local.idcolumn") + "' order by firstname");