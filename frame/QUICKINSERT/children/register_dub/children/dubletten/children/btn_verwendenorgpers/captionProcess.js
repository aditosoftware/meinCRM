var orgmarkiert = a.decodeFirst(a.valueof("$comp.tbl_dublettenORG"));
var persmarkiert = a.decodeFirst(a.valueof("$comp.tbl_dublettenPERS"));

if(orgmarkiert != "" && persmarkiert != "") 
{
    a.rs(a.translate("Org. / Pers. verwenden")); 
}
else if(orgmarkiert != "" && persmarkiert == "")  
{
    a.rs(a.translate("Organisation verwenden")); 
} else if(persmarkiert != "" )
{
    a.rs(a.translate("Person verwenden")); 
}
else a.rs(a.translate("Markierte verwenden"));