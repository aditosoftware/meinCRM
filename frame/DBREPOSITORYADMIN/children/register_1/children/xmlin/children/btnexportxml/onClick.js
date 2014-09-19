import("lib_dbschema")

var filename = a.valueof("$comp.edtExportFile");
	
if(filename != "")
{
    var liste = a.decodeMS(a.valueof("$comp.tblTablelist"));
    var repo = new RepositoryObject();
    var usexsl = a.valueof("$comp.chkUseStylesheet") == "Y" ? true : false;
    repo.exportRepository(liste, filename, usexsl);
    a.showMessage(a.translate("%0" + " " + "Tabellen wurden als XML exportiert.", [liste.length]));
}