import("lib_sql")

var qid = a.decodeFirst(a.valueof("$comp.tblQuestion")); // ID of current question

var sql = a.EMPTY_TABLE_SQL;
if(qid != '')
{
    sql = " select QUESTIONFLOWID, ANSWERTEXT, "
        + " case when TARGETQUESTION_ID = '0' then 'Ende' else " + cast("QUESTIONCODE", "varchar", "4") + " end, QUESTIONFLOWSORT "
        + " FROM QUESTIONFLOW left outer join QUESTION on (TARGETQUESTION_ID = QUESTIONID) "
        + " where QUESTION_ID = '" + qid + "' order by QUESTIONFLOWSORT";
}
a.rq(sql);