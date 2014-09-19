// Hier werden die Image-Variablen für die Fragenabfolge gesetzt

var id = a.valueof("$comp.idcolumn");
var tablequest = a.decodeFirst(a.valueof("$comp.tbl_questions"));
var qid = a.valueof("$comp.QUESTIONNAIRE_ID"); 
if (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW)
{
    // wiederholt aufgerufener Teil eines SQLs um die Übersichtlichkeit zu erhöhen
    var sqlpart = " from QUESTIONLOG where QUESTIONLOG.QUESTION_ID = QUESTION.QUESTIONID "
    + " and QUESTIONNAIRELOG_ID = '" + id + "')";

    // Ermittlung der Parameter aus der aktuell markierten Frage
    var quest = "select QUESTIONID, COMPONENTTYPE, (select QUESTIONLOGID " + sqlpart 
    + ", TARGETQUESTION_ID, (select ANSWERTEXT " + sqlpart 
    + " from QUESTION join QUESTIONFLOW on QUESTIONFLOW.QUESTION_ID = QUESTION.QUESTIONID "
    + " where QUESTION.QUESTIONNAIRE_ID = '" + qid + "'";

    // wenn Antworten vorhanden dann dann Abfolge nach Zielfragen
    if (tablequest != "")	quest = a.sql(quest + " and QUESTION.QUESTIONID = '" + tablequest + "'", a.SQL_ROW);
    // wenn neue Befragung bzw. keine Antworten enthalten dann Sprung zur 1.Zeile
    else
    {
        quest = a.sql(quest + " order by QUESTIONCODE", a.SQL_ROW);
        a.setTableSelection("$comp.tbl_questions", [quest[0]], false);
    }
    a.imagevar("$image.currentQuestionid", quest[0]);
    a.imagevar("$image.currentCompType", quest[1]);
    a.imagevar("$image.currentQuestionlogid", quest[2]);
    a.imagevar("$image.currentTargetid", quest[3]);
    a.imagevar("$image.currentAnswer", quest[4]);
}