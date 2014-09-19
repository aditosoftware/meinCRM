var val = a.valueofObj("$image.currentAnswer")
var comptype = a.valueofObj("$image.currentCompType")
if (val != undefined && val != 0 && comptype == 2)
{
    a.rq("select QUESTIONFLOWID from QUESTIONFLOW where QUESTION_ID = '" + a.valueofObj("$image.currentQuestionid") 
        + "' and ANSWERTEXT = '" + val + "'");
}