import("lib_util");

var campaignid = a.valueof("$comp.campaignid")
var condition = "campaign_id = '" + campaignid + "'";

moveRow("CAMPAIGNSTEP", "$comp.tbl_steps", "CODE", "up", condition);
a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");