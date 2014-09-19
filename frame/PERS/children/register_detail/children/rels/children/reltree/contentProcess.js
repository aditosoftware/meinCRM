import("lib_objrelation");

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
a.returnobject( fillObjectTree ( reltype, a.valueof("$sys.workingmode"), a.valueof("$comp.cmbRelationType"), a.valueof("$comp.relationid") ) );