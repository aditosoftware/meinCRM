import("lib_bulkmail");

// feststellen, an wen gesendet werden soll
// liefert einen der strings ALL, UNDELIVERED, ERROR, SELECTION
var sendmode = a.valueof("$comp.comboSelection");
var mailing = a.valueof("$comp.BULKMAILDEFID");

if(mailing != "")
{
    // erstellen der empfaengerliste
    var rcptlist = buildRcptList(mailing, sendmode);
    if(rcptlist.length > 0)
    {
        lockMailing(mailing, true);
			
        // abarbeiten der empfaengerliste
        processMailingRecords(mailing, rcptlist, true);
		
        a.refresh();
    }
    else
    {
        a.showMessage(a.translate("Es sind keine Empfänger für dieses Mailing definiert."));
    }
}

	
	
// ende