if (a.hasvar("$comp.hasreminder"))
{
    var hasreminder = a.valueofObj("$comp.hasreminder");
    if (hasreminder == "true")
        a.rs("false");
    else
        a.rs("true");
}
else
    a.rs("true");