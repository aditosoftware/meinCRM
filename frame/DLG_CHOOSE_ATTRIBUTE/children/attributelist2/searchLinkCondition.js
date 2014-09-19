//conversion by hand
//a.rs("OBJECT_ID = " + a.valueofObj("$image.FrameID"))
a.rs("HISTORY.HISTORYID IN ( SELECT ATTRLINK.ROW_ID   FROM ATTRLINK   WHERE ( " + a.valueof("$local.condition") + ") ) ");