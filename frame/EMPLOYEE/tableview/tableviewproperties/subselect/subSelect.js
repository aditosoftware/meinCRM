import("lib_sql");

a.rs("(select " + concat(["lastname","firstname"]) + " from pers join relation on (pers.persid = relation.pers_id) "
    + " where relation.relationid = employee.relation_id)");