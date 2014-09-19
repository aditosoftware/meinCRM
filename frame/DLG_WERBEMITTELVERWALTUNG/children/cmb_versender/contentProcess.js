import("lib_sql");

a.rq("select relationid, " + concat(new Array("lastname", "firstname") ) 
    + " from relation join pers on (pers_id = persid)"
    + " join employee on (employee.relation_id = relation.relationid)"
    + " order by lastname asc");