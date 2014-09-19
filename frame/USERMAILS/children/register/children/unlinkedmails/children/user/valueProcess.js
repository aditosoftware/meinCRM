var current = a.valueof("$comp.user");

// damit refresh nicht wieder zurücksetzt
if (current == null || current.length == 0)
    a.rs(a.valueof("$sys.user"));
else
    a.rs(current);