import("lib_tablecomp");
import("lib_keyword");

var row = a.valueofObj("$local.rowdata");

var fields = [
[2, "CODE"],
[3, "STEP"],
[4, "DATE_START"],
[5, "DATE_END"],
[6, "STATE"],
[7, "MEDIUM"],
[8, "COST"],
[9, "QUESTIONNAIRE_ID"],
[10, "COLOUR_FOREGROUND"]
];

var vkfields = 	[[a.valueof("$comp.campaignid"), "CAMPAIGN_ID"]];
var updanz = instable(fields, vkfields, row, "CAMPAIGNSTEP", "CAMPAIGNSTEPID");