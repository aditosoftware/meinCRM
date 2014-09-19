import("lib_frame");

//Meldung und Frame schliessen wenn kein Datensatz selektiert werden konnte 
checkRowCount();

// fill data
if (a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW && a.hasvar("$image.DefaultValues") )
{
    a.setValues(a.valueofObj("$image.DefaultValues"));
}