import("lib_sql")
a.rs("(select " + concat(["LASTNAME", "FIRSTNAME"]) 
    + " from pers join relation on (pers.persid = relation.pers_id) where relation.relationid = history.relation_id)");