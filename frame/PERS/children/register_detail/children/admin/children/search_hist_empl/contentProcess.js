a.rq("select RELATIONID, LASTNAME, FIRSTNAME from RELATION"
    + " join EMPLOYEE on (RELATION.RELATIONID = EMPLOYEE.RELATION_ID)"
    + " join PERS on (RELATION.PERS_ID = PERS.PERSID)");