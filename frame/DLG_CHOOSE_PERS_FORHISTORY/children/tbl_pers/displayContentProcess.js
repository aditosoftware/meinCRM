import("lib_sql")

a.rq("select RELATIONID, ORGNAME, " + concat(["FIRSTNAME", "LASTNAME"]) + " from RELATION "
    + " join ORG on ORGID = ORG_ID join PERS on PERSID = PERS_ID "
    + " where RELATIONID in (" + a.valueof("$local.relids") + ") order by ORGNAME, LASTNAME");