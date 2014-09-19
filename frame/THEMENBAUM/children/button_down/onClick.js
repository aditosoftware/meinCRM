import("lib_themetree");

var nodeID = a.valueof("$comp.treeThemen");
var node_ID = a.sql("select THEME_ID from THEME where THEMEID = '" + nodeID + "'");

moveRowTree("THEME", "THEMESORT", "down", nodeID, node_ID, a.valueof("$comp.cmb_ThemenTyp"));
a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");
a.refresh("$comp.treeThemen");