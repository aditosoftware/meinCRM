var min = a.valueof("$comp.edt_mincount");
var max = a.valueof("$comp.edt_maxcount");

if(min != "")
{
    if((max >= min))
    {
        a.rs(true);
    }
    else
    {
        a.rs(false);
    }
}