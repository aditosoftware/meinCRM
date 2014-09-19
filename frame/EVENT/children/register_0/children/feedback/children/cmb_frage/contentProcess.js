var fragebogenid = a.valueof("$comp.cmb_fragebogen");
if (fragebogenid != '')
    a.rq("select QUESTIONTEXT from QUESTION where QUESTIONNAIRE_ID = '" + fragebogenid + "'");