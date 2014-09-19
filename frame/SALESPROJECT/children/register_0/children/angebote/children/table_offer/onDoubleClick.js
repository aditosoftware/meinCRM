var id = a.decodeFirst(a.valueof("$comp.Table_offer"))
var prompts = new Array();
prompts["ID"] =  id;
prompts["comp4refresh"] = "$comp.Table_offer";
prompts["autoclose"] =  true;

a.openLinkedFrame("OFFER", "OFFER.OFFERID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);