import("lib_bulkmail");

// feststellen, an wen gesendet werden soll
// liefert einen der strings ALL, UNDELIVERED, ERROR, SELECTION
var sendmode = a.valueof("$comp.comboSelection");
var mailing = a.valueof("$comp.BULKMAILDEFID");

if(mailing != "")
{
    // erstellen der empfaengerliste
    var testaddr = a.askQuestion(a.translate("Bitte Testempfänger eingeben"), a.QUESTION_EDIT, "");
	
    if((testaddr != "") && (testaddr != null))
    {
        var rcptlist = new Array();
        rcptlist[0] = new Array(a.valueof("$global.user_relationid"), testaddr);

        // abarbeiten der empfaengerliste
        processMailingRecords(mailing, rcptlist, false);
    }
    else
    {
        a.showMessage(a.translate("Testversand ohne Adresse nicht möglich."));
    }
}

	
	
// ende