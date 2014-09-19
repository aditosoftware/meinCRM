var qid = a.valueof("$comp.cmb_question");
if (qid != '')
    a.rq("select ANSWERTEXT from QUESTIONFLOW where QUESTION_ID = '" + qid + "'");