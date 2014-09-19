import("lib_offerorder");

var links = getLinks(a.valueof("$comp.idcolumn"), true);
a.rs( a.translate("Links (") + links.length + ")");