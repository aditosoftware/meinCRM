var ret = false;
if (a.hasvar("$comp.hasreminder"))
{
    var hasreminder = a.valueofObj("$comp.hasreminder");
    a.rs (hasreminder == "true")
}
a.rs(ret);