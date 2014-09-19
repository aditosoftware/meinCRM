import("lib_calendar")
	
/*
* Generiert ein Array mit Columns und Werte für ToDos für verknüpfte Frames und Datensätze.
* 
* @param {String} frame req Name des Frames
* @param {String} rowid req ID des verknüpften Datensatzes
*
* @return {[]} mit Columns und Werte
*/

function MakeLinkedToDos( frame, rowid ) 
{
    var tabret = new Array();
    var tab = getLinkedToDos ( frame, rowid );
    var columns = new Array ("FAELLIG", "BETREFF", "STATUS", "TEXT", "MITARBEITER", "ROW_ID");
    for (var i = 0; i < tab.length; i++)
    {
        var zw = tab[i]
        zw = zw.concat(rowid)
        tabret[i] = zw.slice(4);
    }
    return new Array(columns,tabret);
}

/*

* Schreibt die Fragebogenauswertung in die Tabelle RPT_QUESTIONNAIRE.
* 
* @param {String} pCondition req
* 
*/
function PrintQuest(pCondition)
{
    var column;
    var type;
    var sql = "select QUESTIONNAIRE.TITLE, QUESTION.QUESTIONTEXT, QUESTIONLOG.ANSWERTEXT, QUESTION.QUESTIONCODE, QUESTIONNAIRELOGID "
    + " from QUESTIONNAIRELOG join QUESTIONLOG on QUESTIONNAIRELOGID = QUESTIONLOG.QUESTIONNAIRELOG_ID "
    + " join QUESTIONNAIRE on QUESTIONNAIREID = QUESTIONNAIRELOG.QUESTIONNAIRE_ID "
    + " join QUESTION on QUESTIONID = QUESTIONLOG.QUESTION_ID "
    + " where QUESTION.COMPONENTTYPE in (1, 2, 4) and " + pCondition; // Radio, Combo, List (Memo kann nicht ausgewertet werden)

    sql = a.sql(sql, a.SQL_COMPLETE);
	
    var sql2 = new Array(new Array);	// 2.Array zur Darstellung der Listenelemente
    var k = 0;				// Startwert der Zählvariable für 2.Array
    for (i=0; i< sql.length; i++)
    {
        var list = sql[i][2].split("; ")
        if (list.length > 1)
        {
            for (j=2; j<list.length-1; j++)	// Beginn bei 2. Listenwert ...
            {
                sql2[k+j-2] = new Array(sql[i][0], sql[i][1], list[j], sql[i][3], sql[i][4])	
            }
            sql[i][2] = list[1]	// ... da anschließend Liste auf ersten Listenwert reduziert wird
            k = k + j -2
        }
    }
    sql = sql2.concat(sql)
	
    a.sqlDelete("RPT_QUESTIONNAIRE", null); // Löschen und anschließendes Befüllen der Tabelle RPT_QUESTIONNAIRE
    column = new Array("TITLE", "QUESTIONTEXT", "ANSWERTEXT", "QUESTIONCODE", "QUESTIONNAIRELOG_ID")
    type = a.getColumnTypes("AO_DATEN", "RPT_QUESTIONNAIRE", column)
    
    for (i=0; i<sql.length; i++)
        a.sqlInsert("RPT_QUESTIONNAIRE", column, type, new Array(sql[i][0], sql[i][1], sql[i][2], sql[i][3], sql[i][4]))

    // gruppiertes Auslesen, Löschen und nochmaliges Einlesen mit Zähler in die Tabelle RPT_QUESTIONNAIRE
    sql = a.sql("select max(TITLE), max(QUESTIONTEXT), max(ANSWERTEXT), count(ANSWERTEXT), "
        + "max(QUESTIONCODE) as code, max(QUESTIONNAIRELOG_ID) from RPT_QUESTIONNAIRE group by TITLE, QUESTIONTEXT, "
        + "ANSWERTEXT order by code", a.SQL_COMPLETE);
    a.sqlDelete("RPT_QUESTIONNAIRE", null);
    column = new Array("TITLE", "QUESTIONTEXT", "ANSWERTEXT", "ANSWERCOUNT", "QUESTIONCODE", "QUESTIONNAIRELOG_ID")    
    type = a.getColumnTypes("AO_DATEN", "RPT_QUESTIONNAIRE", column)
    for (i=0; i<sql.length; i++)
        a.sqlInsert("RPT_QUESTIONNAIRE", column, type, new Array(sql[i][0], sql[i][1], sql[i][2], sql[i][3], sql[i][4], sql[i][5]))
    return([sql, column]);
}