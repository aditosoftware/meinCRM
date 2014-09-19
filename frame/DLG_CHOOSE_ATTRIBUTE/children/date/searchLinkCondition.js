//conversion by hand
//var attribute1 = a.valueof("$comp.attributelist1");
//var attribute2 = a.valueof("$comp.attributelist2");
//var value = "";
//if (attribute2 != "")	value = attribute2;
//else if (attribute1 != "")	 value = attribute1;
//a.rs("OBJECT_ID = " + a.valueofObj("$image.FrameID") + " and ATTR_ID = " + value);
a.rs("HISTORY.HISTORYID IN ( SELECT ATTRLINK.ROW_ID   FROM ATTRLINK   WHERE ( " + a.valueof("$local.condition") + ") ) ");