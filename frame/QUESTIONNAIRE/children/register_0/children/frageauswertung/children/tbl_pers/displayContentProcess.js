var questionnaireid = a.valueof("$comp.QUESTIONNAIREID");
var questionid = a.valueof("$comp.cmb_question");
var answer = a.valueof("$comp.cmb_answer");

if ( questionnaireid != '' && questionid != '' && answer != '')
{
    var sqlstr = "select QUESTIONLOGID, SALUTATION, FIRSTNAME, LASTNAME, ORGNAME from QUESTIONNAIRELOG "
    + " join QUESTIONLOG on QUESTIONNAIRELOGID = QUESTIONLOG.QUESTIONNAIRELOG_ID"
    + " join RELATION on RELATIONID = QUESTIONNAIRELOG.RELATION_ID"
    + " join PERS on PERSID = RELATION.PERS_ID "
    + " left join ORG on ORGID = RELATION.ORG_ID"
    + " where QUESTIONNAIRELOG.QUESTIONNAIRE_ID = '" + questionnaireid + "' and "
    + " QUESTIONLOG.QUESTION_ID = '" + questionid + "' and QUESTIONLOG.ANSWERTEXT like '%" + answer + "%'";
		
    a.rq(sqlstr);
}
else a.rq(a.EMPTY_TABLE_SQL);