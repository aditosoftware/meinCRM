import("lib_util");

var campaignid = a.valueof("$comp.campaignid")
var condition = "campaign_id = '" + campaignid + "'";

a.rs( moveActive("CAMPAIGNSTEP", "$comp.tbl_steps", "CODE", "down", condition) );