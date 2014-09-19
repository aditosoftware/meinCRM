var val = a.valueofObj("$image.currentAnswer")
var comptype = a.valueofObj("$image.currentCompType")
if (val != undefined && val != 0 && comptype == 4)
{
    val = a.decodeMS(val)
    var qid = a.valueofObj("$image.currentQuestionid")

    if (val.length > 0)
        a.rs(a.encodeMS(a.sql("select QUESTIONFLOWID from QUESTIONFLOW where QUESTION_ID = '" + qid 
            + "' and ANSWERTEXT in ('" + val.join("','") + "')", a.SQL_COLUMN)));
}