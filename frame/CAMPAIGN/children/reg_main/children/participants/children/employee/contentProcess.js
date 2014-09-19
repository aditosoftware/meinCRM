a.rq("select relationid, lastname, firstname from relation"
    + " join employee on (relation.relationid = employee.relation_id)"
    + " join pers on (relation.pers_id = pers.persid)");