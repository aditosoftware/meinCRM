// Ausblenden bei Rechte und Folgehistorie
a.rs( a.valueofObj("$global.useRights") && (
a.valueof("$comp.historyid") == a.valueof("$comp.HISTORY_ID") || a.valueof("$comp.HISTORY_ID") == "") );