var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
toDel.push(new Array("TABLEACCESS", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
toDel.push(new Array("HISTORYLINK", "OBJECT_ID = 5 and ROW_ID = '" + id + "'"));
toDel.push(new Array("CAMPAIGNSTEP", "CAMPAIGN_ID = '" + id + "'"));
toDel.push(new Array("CAMPAIGNLOG", "CAMPAIGN_ID = '" + id + "'"));
toDel.push(new Array("CAMPAIGNCOST", "CAMPAIGN_ID = '" + id + "'"));

a.sqlDelete(toDel)