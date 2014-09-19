import("lib_keyword");

var qid = a.valueof("$comp.QUESTIONNAIREID");
var list = a.EMPTY_TABLE_SQL;
if(qid != "")
{
    // alle Fragen laden, die zu diesem Interview gehören	    
    list = "SELECT QUESTIONID, QUESTIONCODE, COMPONENTTYPE, QUESTIONTEXT, HINTTEXT"
        + " FROM QUESTION where QUESTIONNAIRE_ID = '" + qid + "' ORDER BY QUESTIONCODE";
}
a.rq(list);