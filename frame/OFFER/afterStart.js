import("lib_frame");

if ( a.hasvar("$image.DefaultValues") )
{
    a.setValues(a.valueofObj("$image.DefaultValues"));
}

//Meldung und Frame schliessen wenn kein Datensatz selektiert werden konnte 
checkRowCount();