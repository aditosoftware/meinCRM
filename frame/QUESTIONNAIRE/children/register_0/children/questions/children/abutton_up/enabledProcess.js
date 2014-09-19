import("lib_util");

a.rs(moveActive("QUESTIONFLOW", "$comp.tblAnswer", "QUESTIONFLOWSORT", "up", "QUESTION_ID = '" + a.decodeFirst(a.valueof("$comp.tblQuestion")) + "'") 
    && a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT);