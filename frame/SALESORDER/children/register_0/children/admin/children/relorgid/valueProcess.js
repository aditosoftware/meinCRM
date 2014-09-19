a.rq("select RELATIONID from RELATION where ORG_ID = (select ORG_ID from RELATION where RELATIONID = '" 
    + a.valueof("$comp.RELATION_ID") + "') and PERS_ID is null")