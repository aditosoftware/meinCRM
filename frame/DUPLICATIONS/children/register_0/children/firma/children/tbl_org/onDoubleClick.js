var relationids = a.decodeMS( a.decodeFirst( a.valueof("$comp.tbl_org") ) );

a.openFrame("ORG", "RELATIONID in ('" + relationids.join("','") + "')", false, a.FRAMEMODE_TABLE_SELECTION);