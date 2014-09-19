import("lib_sql");
var person = a.sql("select " + concat(new Array("lastname", "firstname"))
    + " from pers join relation on (pers.persid = relation.pers_id) where relation.relationid = '" + a.valueof("$comp.relation_id") + "'");
var string = a.translate("Mitarbeiter")+": "+ person + " (" + a.valueof("$comp.login") + ")";
a.rs(string);