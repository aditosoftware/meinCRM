var path = "";
if ( a.hasvar("$image.iconpfad") ) path = a.valueof("$image.iconpfad");

var name = a.askQuestion(a.translate("Icon auswählen"), a.QUESTION_FILECHOOSER, path);
if (name != null && name != "")  
{
    a.imagevar("$image.iconpfad", name ) // name.substr( 1, name.length - fileIO.getAbsolute(name).length ));
    a.saveTableEdit("$comp.tbl_content");
    var icon = a.doClientIntermediate(a.CLIENTCMD_GETDATA, [name, a.DATA_BINARY]);
    a.updateTableCell("$comp.tbl_content", a.decodeFirst(a.valueof("$comp.tbl_content")), 3, icon, icon);
    a.saveTableEdit("$comp.tbl_content");
}