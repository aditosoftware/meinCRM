import("lib_util");

moveRow("QUESTIONFLOW", "$comp.tblAnswer", "QUESTIONFLOWSORT", "up", "QUESTION_ID = '" + a.decodeFirst(a.valueof("$comp.tblQuestion")) + "'");
a.refresh("$comp.AButton_up");
a.refresh("$comp.AButton_down");