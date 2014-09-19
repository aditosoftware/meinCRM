a.rq("select orgname from org join relation on (orgid = org_id) where "
	+ "relationid in (select row_id from attrlink join attr on (attrid = attrlink.attr_id) where attrname = 'Zielgruppe' "
	+ " and value_id  in (select attrid from attr  where attrname = 'Wettbewerber'))  "
	+ " union select 'nicht bekannt' from org order by 1");