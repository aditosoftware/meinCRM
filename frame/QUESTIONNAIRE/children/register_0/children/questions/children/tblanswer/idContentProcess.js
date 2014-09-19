//var qid = a.decodeFirst(a.valueof("$comp.tblQuestion")); // ID of current question
//
//var sql = a.EMPTY_TABLE_SQL;
//if(qid != '')
//{
//	sql = " select QUESTIONFLOWID, ANSWERTEXT, "
//			+ " case when TARGETQUESTION_ID = '0' then 'Ende' else QUESTIONCODE end "
//      + " FROM QUESTIONFLOW left outer join QUESTION on (TARGETQUESTION_ID = QUESTIONID) "
//			+ " where QUESTION_ID = '" + qid + "'";
//}
//a.rq(sql);