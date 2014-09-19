import("lib_themetree");

var nodeID = a.valueof("$comp.treeThemen");
var node_ID = a.sql("select THEME_ID from THEME where THEMEID = '" + nodeID + "'");

a.rs(moveActiveTree("THEME", "$comp.treeThemen", "THEMESORT", "up", node_ID, a.valueof("$comp.cmb_ThemenTyp") ) && nodeID != '');