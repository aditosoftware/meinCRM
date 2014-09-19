var qid = a.valueof("$comp.QUESTIONNAIREID");
if (qid != '')
    a.rq("select QUESTIONID, QUESTIONTEXT from QUESTION where QUESTIONNAIRE_ID = '" + qid + "'");