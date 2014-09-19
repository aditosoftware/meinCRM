var relid = a.valueof("$comp.RELATION_ID");

if (relid != '')
a.rq("select RELATIONID from RELATION where ORG_ID = (select ORG_ID from RELATION where RELATIONID = '" + relid + "') and PERS_ID is null");