var prompts = [];
var defaultval = [];

defaultval["$comp.HISTORY_ID"] =  a.valueof("$comp.idcolumn");
defaultval["$comp.SUBJECT"] = a.valueof("$comp.SUBJECT");

prompts["DefaultValues"] = defaultval;

a.openFrame("HISTORY", null, false, a.FRAMEMODE_NEW, null, false, prompts);