import("lib_objrelation");

var ret = [];
var reltype = "";
switch(a.valueof("$comp.AOTYPE"))
{
    case "2":
        reltype = "priv";
        break;
    case "3":
        reltype = "pers";
        break;
}
ret = getEntry( reltype );
a.ro(ret);