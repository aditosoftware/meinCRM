var val = parseInt(a.valueof("$comp.percent"), 10);
if ( val < 0 || val > 100 || val.toString() == 'NaN') 
    a.showMessage("Es wurde ein ungültiger Wert in erledigt gesetzt.\nDer Wert muss zwischen 0 und 100 liegen !")