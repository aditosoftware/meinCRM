import("lib_campaign")

var res = testQuestionnaire(a.valueof("$comp.QUESTIONNAIREID"))

if (res == "") a.showMessage(a.translate("Interview ist durchgängig."));
else a.showMessage(res);