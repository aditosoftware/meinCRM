var ix = a.decodeFirst(a.valueof("$comp.tblIndex"));
var ret = "";
if (ix != '')
{
    ret = a.sql("select COLUMNLIST from AOSYS_INDEXREPOSITORY where AOSYS_INDEXREPOSITORYID = '" + ix + "'");
}
a.rs( ret );