import("lib_util");

moveRow("QUESTION", "$comp.tblQuestion", "QUESTIONCODE", "up", "QUESTIONNAIRE_ID = '" + a.valueof("$comp.idcolumn")+ "'");
a.refresh("$comp.QButton_up");
a.refresh("$comp.QButton_down");