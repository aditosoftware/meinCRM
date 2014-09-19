import("lib_sql");

a.rs("select " + concat(["LASTNAME", "FIRSTNAME"]) 
    + " from PERS join RELATION on PERS.PERSID = RELATION.PERS_ID where RELATION.RELATIONID = QUESTIONNAIRELOG.RELATION_ID");