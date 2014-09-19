import("lib_attr")

a.returnobject(getAttrList_First(a.valueof( "$local.objectid")));

//a.rq("select ATTRID, ATTRNAME from ATTR join ATTROBJECT on (ATTR.ATTRID = ATTROBJECT.ATTR_ID) " 
//				+ "where ATTR.ATTR_ID is null and ATTROBJECT = " + 	a.valueof( "$local.objectid") + " order by ATTRSORT, ATTRNAME");