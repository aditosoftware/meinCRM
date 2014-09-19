var bmid = a.valueof("$comp.BULKMAILDEFID");

if(bmid != "")
{
    var sql = " SELECT BULKMAILRCPTID, "
    + " case when (select count(*) from COMMRESTRICTION where RELATION_ID = RELATION.RELATIONID and MEDIUM = 2 ) > 0 or "
    + " (select count(*) from COMMRESTRICTION join RELATION R on RELATION_ID = R.RELATIONID where R.ORG_ID = ORG.ORGID and MEDIUM = 2 and R.PERS_ID is null) > 0 then 1 else 0 end, "
    + " PERS.LASTNAME, PERS.FIRSTNAME, ORG.ORGNAME, EMAILUSED, SENTDATE, LASTRESULT "
    + " FROM BULKMAILRCPT join RELATION ON (RELATION.RELATIONID = BULKMAILRCPT.RELATION_ID) "
    + " join ORG on (ORG.ORGID = RELATION.ORG_ID) left join PERS ON (PERS.PERSID = RELATION.PERS_ID) "
    + " WHERE BULKMAILDEF_ID = '" + bmid + "' order by PERS.LASTNAME ";
    a.rq(sql);
}