//Eintrag in Questlog schreiben + refresh()
var answerid = ""; //für questionflow_id
var answer = ""; //für answertext
var text = "";
var questionid = a.valueofObj("$image.currentQuestionid");
var infosql;
var componente = a.valueofObj("$image.currentCompType");
var type;
var column;

//Welche Antwort wurde gegeben?
switch(componente) 
{
    //Radio Button
    case '1':
        answerid = ""; //a.valueof("$comp.answer_rb");
        answer = a.valueof("$comp.answer_rb");
        infosql = a.sql("select answertext, targetquestion_id from questionflow where ANSWERTEXT = '" + answer 
            + "' and question_id = '" + questionid + "'", a.SQL_COMPLETE);
        break;
    //Combobox
    case '2':
        answerid = a.valueof("$comp.answer_cmb");
        infosql = a.sql("select answertext, targetquestion_id from questionflow where questionflowid = '" + answerid + "'", a.SQL_COMPLETE);
        answer = infosql.length > 0 ? infosql[0][0] : "";
        break;
    //Memo Feld
    case '3':
        answerid = "";
        infosql = a.sql("select answertext, targetquestion_id from questionflow where question_id = '" + questionid + "'", a.SQL_COMPLETE);
        answer = a.valueof("$comp.answer_memo");
        break;
    //Listbox
    case '4':
        answerid = "" // bei Listbox bleibt answerid leer
        var listbox = a.valueof("$comp.answer_list");
        infosql = a.sql("select answertext, targetquestion_id from questionflow where questionflowid = '" + a.decodeMS(listbox)[0] + "'", a.SQL_COMPLETE);
        answer = a.encodeMS(a.sql("select answertext from questionflow where questionflowid in ('" + a.decodeMS(listbox).join("','")+ "')", a.SQL_COLUMN));
        break;
}

if ( infosql.length > 0 )
{
    var zielfrage = infosql[0][1]; //wenn Zielfrage 0 dann Ende, sonst weiter mit nächster Frage
    var datum = a.valueof("$sys.date");
    var user = a.valueof("$sys.user");
    //AntwortsDS in Tabelle Questionlog schreiben
    var value  = new Array();
    if(componente == '3' ) {
        text = "Y"
    } else {
        text = "N"
    }
    if (a.valueof("$image.currentQuestionlogid") == "")
    {
        column = ["QUESTIONLOGID", "QUESTIONNAIRELOG_ID", "QUESTIONNAIRE_ID", "QUESTIONFLOW_ID", "QUESTION_ID", 
            "ISTEXTNOTE", "ANSWERTEXT", "DATE_NEW", "USER_NEW"];
        type   = a.getColumnTypes( "QUESTIONLOG", column);
        value = [a.getNewUUID(), a.valueof("$comp.QUESTIONNAIRELOGID"), a.valueof("$comp.QUESTIONNAIRE_ID"), zielfrage, questionid
            , text, answer, datum, user];
        a.sqlInsert("QUESTIONLOG", column, type, value);
    }
    else
    {
        column = ["QUESTIONFLOW_ID", "ISTEXTNOTE", "ANSWERTEXT", "DATE_EDIT", "USER_EDIT"];
        type   = a.getColumnTypes( "QUESTIONLOG", column);
        value = [answerid, text, answer, datum, user];
        a.sqlUpdate("QUESTIONLOG", column, type, value, "QUESTIONLOGID = '" + a.valueofObj("$image.currentQuestionlogid") + "'");
    }
    //Image Variable mit current Questionid aktualisieren
    a.imagevar("$image.currentQuestionid", zielfrage);

    //Antwort aller Felder leeren
    a.setValue("$comp.answer_rb", "");
    a.setValue("$comp.answer_cmb", "");
    a.setValue("$comp.answer_list", "");
    a.setValue("$comp.answer_memo", "");

    //Refresh des Frames
    a.refresh("$comp.tbl_questions");
    a.setTableSelection("$comp.tbl_questions", [zielfrage], true );
    a.refresh();
}
else a.showMessage(a.translate("Bitte Auswahl treffen"));