import("lib_attr")

var stimmung = GetAttribute( "Stimmung", a.valueof("$image.FrameID"), a.valueof("$comp.idcolumn"));
a.rs(stimmung == 'schlecht')