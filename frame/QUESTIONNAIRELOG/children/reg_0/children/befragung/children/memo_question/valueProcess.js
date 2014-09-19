var qid = a.valueofObj("$image.currentQuestionid");

if (qid != '')
    a.rq("select QUESTIONTEXT from QUESTION where QUESTIONID = '" + qid + "'");
else a.rs("");