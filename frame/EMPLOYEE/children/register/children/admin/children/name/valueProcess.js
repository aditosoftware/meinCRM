var id = a.valueof("$comp.relation_id");
if (id != "")
{
    a.rq("select lastname from pers join relation on (pers.persid = relation.pers_id) where relation.relationid = '" + id + "'");
}
else
{
    a.rs("");
}