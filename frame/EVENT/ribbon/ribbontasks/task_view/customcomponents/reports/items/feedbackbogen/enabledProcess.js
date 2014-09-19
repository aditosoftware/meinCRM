var feedback = a.sql("select count(*) from FEEDBACK where EVENT_ID = '" + a.valueof("$comp.idcolumn") + "'")
a.rs(a.valueof("$comp.FOLDER") != 'Y' && feedback > 0)