import("lib_sql");
a.rq("select relationid, " + concat(new Array("lastname", "firstname")) + " from relation"
    + " join employee on (relation.relationid = employee.relation_id)"
    + " join pers on (relation.pers_id = pers.persid) order by lastname");