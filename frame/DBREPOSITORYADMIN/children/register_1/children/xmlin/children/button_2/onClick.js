var filename = a.askQuestion(a.translate("Bitte XML-Datei auswählen"), a.QUESTION_FILECHOOSER, "");
filename = filename.replace(/\\/g, "/");
a.setValue("$comp.edtExportFile", filename);