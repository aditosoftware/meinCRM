a.rs("orgid in (select org_id from relation where relationid in "
	+ "(select row_id from attrlink join attr on attrid = attrlink.attr_id "
	+ "where attrname = 'Zielgruppe' and object_id = 1 and aoactive = 1 and value_id = "
	+ "(select attrid from attr where attrname = 'Lieferant')))");