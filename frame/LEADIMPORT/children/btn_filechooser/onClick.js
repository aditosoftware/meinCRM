import("lib_lead");
var file = a.askQuestion(a.translate("Importdatei wählen !"), a.QUESTION_FILECHOOSER, "" )

if (file != null)
{
    a.setValue("$comp.IMPORTFILE", file)
    LoadImportFile(file);
}