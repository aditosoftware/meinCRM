import("lib_attr");

var list = [];
var tab = GetAttrArray( "40", a.valueof("$comp.PRODUCT_ID"), "Technische Merkmale." );
for (i=0; i<tab.length; i++)
{
    list.push ([tab[i][0], tab[i][4], tab[i][5]])
}
a.ro( list);