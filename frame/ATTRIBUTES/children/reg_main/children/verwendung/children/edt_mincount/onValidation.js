var min = a.valueof("$comp.edt_mincount");
var max = a.valueof("$comp.edt_maxcount");

if(max != "")
{
    if((min <= max))
    {
        a.rs(true);
    }
    else
    {
        a.rs(false);
    }
}