import("lib_sql");

a.rq("select ADDRESSID, " + concat(["KEYNAME1", "ADDRIDENTIFIER"]) + " from KEYWORD join ADDRESS on KEYVALUE = ADDR_TYPE join RELATION on RELATIONID = RELATION_ID"
    + " where KEYTYPE = 15 and ( RELATIONID = '" + a.valueof("$comp.RELATION_ID") + "' or RELATIONID = '" + a.valueof("$comp.relorgid") + "')");