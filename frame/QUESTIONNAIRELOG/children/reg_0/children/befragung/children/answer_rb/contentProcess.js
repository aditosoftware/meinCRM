if (a.valueofObj("$image.currentCompType") == '1')
    a.rq("select ANSWERTEXT from QUESTIONFLOW where QUESTION_ID = '" + a.valueofObj("$image.currentQuestionid") 
        + "' order by QUESTIONFLOWSORT");