import("lib_dbschema")

var s;
var filename = a.valueof("$comp.edtImportFile");
if(filename != "")
{
    s = a.doClientIntermediate(a.CLIENTCMD_GETDATA, new Array(filename));
    var xmldoc = new XML(s);
}

var liste = a.decodeMS(a.valueof("$comp.tblTransferTable"));
var repo = new RepositoryObject();
var impcount = 0;
for(var index = 0; index < liste.length; index++)
{
    s = xmldoc.datamodel.table.(@name == liste[index]);
var tbl = repo.tableFromXml(s);

    if(tbl != null)
    {
        var go = true;
        if(tbl.existsInRepo())
        {
            go = (a.askQuestion(liste[index] + a.translate(" existiert im Repository. Tabellendefinition ersetzen?"), a.QUESTION_YESNO, "") == "true");
            if(go == true) {
                repo.removeTable(liste[index]);
            }
        }
        if(go == true) 
        {
            repo.writeToRepository(tbl);
            impcount++;
        }
    }
}

a.refresh("$comp.tblTablelist");
a.showMessage(impcount + " " +a.translate("Tabellen wurden importiert."));


// ende