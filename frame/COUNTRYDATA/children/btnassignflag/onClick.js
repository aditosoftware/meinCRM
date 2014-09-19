var datei = a.askQuestion(a.translate("Bitte Datei auswählen"), a.QUESTION_FILECHOOSER, "");

if((datei != "") && (datei != null))
{
    var daten = a.doClientIntermediate(a.CLIENTCMD_GETDATA, new Array(datei, a.DATA_BINARY));

    var spalten = new Array(1);
    spalten[0] = "FLAGICON";
   
    var typen = new Array(1);
    typen = a.getColumnTypes( "COUNTRYINFO", spalten);
   
    var werte = new Array(1);
    werte[0] = daten;
		
    a.sqlUpdate("COUNTRYINFO", spalten, typen, werte, "ISO2 = '" + a.valueof("$comp.ISO2") + "'");
    a.refresh();
}