import("lib_sql")

a.rq("select RELATIONID, " + concat(["FIRSTNAME", "LASTNAME", "', E-Mail:'","ADDR"]) + " from RELATION "
    + " left join ORG on ORGID = ORG_ID left join PERS on PERSID = PERS_ID "
    + " join COMM on (RELATIONID = COMM.RELATION_ID and COMM.MEDIUM_ID = 3 and COMM.STANDARD = 1) "
    + " where RELATIONID in (" + a.valueof("$local.relids") + ")");