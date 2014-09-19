if (a.valueofObj("$image.currentCompType") == '4')
    a.rq("select QUESTIONFLOWID, ANSWERTEXT from QUESTIONFLOW where QUESTION_ID = '" + a.valueofObj("$image.currentQuestionid") 
        + "' order by QUESTIONFLOWSORT");