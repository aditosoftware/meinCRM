var id = a.valueof("$comp.idcolumn");
var qid = a.valueof("$comp.QUESTIONNAIRE_ID");
var quest = a.createEmptyTable(4);

if (id != '' && qid != '')
{
    var color = -1; // ws Hintergrund
    var sqlpart = " from QUESTIONLOG where QUESTIONLOG.QUESTION_ID = QUESTION.QUESTIONID "
    + " and QUESTIONNAIRELOG_ID = '" + id + "')";
    quest = a.sql("select QUESTIONID, " + color + ", QUESTIONCODE, QUESTIONTEXT, "
        + " (select ANSWERTEXT " + sqlpart + ", (select QUESTIONLOGID " + sqlpart
        + " from QUESTION where QUESTION.QUESTIONNAIRE_ID = '" + qid 
        + "' order by QUESTION.QUESTIONCODE", a.SQL_COMPLETE);
}
a.ro(quest)