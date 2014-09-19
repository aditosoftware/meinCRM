import("lib_util");

a.rs(moveActive("QUESTION", "$comp.tblQuestion", "QUESTIONCODE", "down", "QUESTIONNAIRE_ID = '" + a.valueof("$comp.idcolumn") + "'") 
    && a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT);