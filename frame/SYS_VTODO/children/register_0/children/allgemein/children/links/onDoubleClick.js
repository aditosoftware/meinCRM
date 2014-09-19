var entry = a.valueofObj("$image.entry");
var current = a.decodeMS(a.decodeFirst(a.valueof("$comp.links")));

var link = new Array();
link[calendar.LINKS] = "1";
link["LINK_ALIAS_1"] = current[0];
link["LINK_TABLE_1"] = current[1];
link["LINK_IDCOLUMN_1"] = current[2];
link["LINK_DBID_1"] = current[3];
link["LINK_FRAME_1"] = current[4];
link["LINK_TITLE_1"] = current[5];
calendar.openLinks(a.WINDOW_CURRENT, entry[calendar.ID], link, true);