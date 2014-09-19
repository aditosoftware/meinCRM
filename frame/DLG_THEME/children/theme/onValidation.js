var bezeichnung = a.valueof("$comp.tbBezeichnung");

if(bezeichnung=="")
    a.rs("Die Bezeichnung darf nicht leer sein!")
else
    a.rs("true");