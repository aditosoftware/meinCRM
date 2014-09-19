var historyID = a.valueof("$comp.idcolumn");
a.openFrame("HISTORY_FOLGE", "HISTORY_ID = '" + historyID + "' and HISTORY_ID <> HISTORYID", a.WINDOW_CURRENT, a.FRAMEMODE_TABLE_SELECTION);