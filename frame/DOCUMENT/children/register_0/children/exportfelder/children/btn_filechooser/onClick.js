var file = a.askQuestion(a.translate("Exportdatei wählen !"), a.QUESTION_FILECHOOSER, "" )

if (file != null)
{
    a.setValue("$comp.EXPORTFILE", file)
}