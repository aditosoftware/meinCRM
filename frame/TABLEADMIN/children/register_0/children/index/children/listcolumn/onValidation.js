var ix = a.decodeFirst(a.valueof("$comp.tblIndex"));

if(ix != "")
{
    var spalten = ["COLUMNLIST"];
    var typen = a.getColumnTypes("AOSYS_INDEXREPOSITORY", spalten);
    var werte = [ a.valueof("$comp.listColumn") ];
    a.sqlUpdate("AOSYS_INDEXREPOSITORY", spalten, typen, werte, "AOSYS_INDEXREPOSITORYID = '" + ix + "'");
}