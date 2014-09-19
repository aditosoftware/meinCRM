var relationids = a.decodeMS( a.decodeFirst( a.valueof("$comp.tbl_pers") ) );

a.openFrame("PERS", "RELATIONID in ('" + relationids.join("','") + "')", false, a.FRAMEMODE_TABLE_SELECTION);