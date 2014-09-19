var pid = a.sql("select relation_id from AdvertisingShipment where AdvertisingShipmentid = '" + a.decodeFirst(a.valueof("$comp.tblAdvertisingShipments")) + "'");


var prompts = new Array();
prompts["ID"] = pid;
prompts["comp4refresh"] = "$comp.tblAdvertisingShipments";
prompts["autoclose"] =  true;

var condition = "RELATION.RELATIONID = '" + pid + "'";

if ( a.valueof("$global.upwardLink") == "link")
	a.openLinkedFrame("PERS", condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
else
	a.openFrame("PERS", condition, false, a.FRAMEMODE_SHOW, null, true);