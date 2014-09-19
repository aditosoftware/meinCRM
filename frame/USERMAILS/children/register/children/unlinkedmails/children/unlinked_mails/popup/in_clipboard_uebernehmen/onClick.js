var decoded = a.decodeFirst(a.valueof("$comp.Tabelle_Mails"));
if (decoded != '')
{
	var addr = a.sql("SELECT RECIPIENT FROM ASYS_MAILREPOSIT where ID = "+decoded );
	var details = new Array(addr);
	a.doClientIntermediate(a.CLIENTCMD_TOCLIPBOARD, details);
}