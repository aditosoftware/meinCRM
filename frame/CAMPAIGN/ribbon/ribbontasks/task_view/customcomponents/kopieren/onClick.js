var id = a.valueof("$comp.idcolumn");

// Campaign kopieren
var name = a.askQuestion(a.translate("Name der neuen Kampagne:"), a.QUESTION_EDIT, "")
if ( name != null)
{
    // Stufen kopieren
    var steps = a.sql("select CODE, STEP, DATE_START, DATE_END, STATE, MEDIUM, COST, QUESTIONNAIRE_ID, COLOUR_FOREGROUND "
        + " from CAMPAIGNSTEP where CAMPAIGN_ID = '" + id + "'", a.SQL_COMPLETE);
    // Fixkosten kopieren
    var costs = a.sql("select CATEGORY, NET from CAMPAIGNCOST where CAMPAIGN_ID = '" + id + "'", a.SQL_COMPLETE);

    var prompts = new Array();
    var defaultvalue = new Array();
    defaultvalue["$comp.name"] = name;
    prompts["DefaultValues"] = defaultvalue;
    prompts["steps"] = steps;
    prompts["costs"] = costs;
    prompts["autoclose"] =  false;

    a.openLinkedFrame("CAMPAIGN", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);
}