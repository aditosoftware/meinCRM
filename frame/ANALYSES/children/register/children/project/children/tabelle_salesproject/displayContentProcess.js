import("lib_keyword");
import("lib_sql")

var condition = "";

	var status = a.valueof("$comp.Combobox_Status"); if (status != '') condition += " AND STATUS = "+status;
	var phase = a.valueof("$comp.Combobox_Phase"); if (phase != '') condition += " AND PHASE = "+phase;
	var volOp = a.valueof("$comp.Combobox_Vol");
	var vol = a.valueof("$comp.Edit_Vol");
		if (volOp != '' && vol != '') condition += " AND VOLUME "+volOp+vol;
	var von = a.valueof("$comp.Edit_von"); 
		if (von != '') condition += " AND " + getTimeCondition("STARTDATE", ">", von, "AO_DATEN");
	var bis = a.valueof("$comp.Edit_bis"); 
		if (bis != '') condition += " AND " + getTimeCondition("STARTDATE", "<", bis, "AO_DATEN")
	var pm = a.valueof("$comp.Combobox_ProjManager"); 
		if (pm != '') condition += " AND SALESPROJECTID in (select SALESPROJECT_ID from SPMEMBER where RELATION_ID = '"+pm+"')";

// users mit der Rolle Salesproject 
var users = tools.getUsersWithRole("PROJECT_Projekt");

var tab = a.sql("select SALESPROJECTID, -1, PROJECTTITLE, "
	+ " (select KEYNAME1 from KEYWORD where" + getKeyTypeSQL("SPPHASE") + " and KEYVALUE = SALESPROJECT.PHASE), "
	+ " (select KEYNAME1 from KEYWORD where" + getKeyTypeSQL("SPSTATUS") + " and KEYVALUE = SALESPROJECT.STATUS), "
	+ " VOLUME, SALESPROJECT.STARTDATE, '', "
	+ " (select max(" + concat(["FIRSTNAME", "LASTNAME"]) + ") from SPMEMBER join RELATION on (RELATIONID = SPMEMBER.RELATION_ID) "
	+ " join PERS on (PERSID = RELATION.PERS_ID) join EMPLOYEE on (EMPLOYEE.RELATION_ID = SPMEMBER.RELATION_ID) "
	+ " where SALESPROJECT.SALESPROJECTID = SPMEMBER.SALESPROJECT_ID and "
	+ " EMPLOYEE.LOGIN in ('" + users.join("', '") + "') and SALESPROJECTROLE = (select KEYVALUE from KEYWORD where KEYNAME1 = 'Projektleiter' and "
	+ getKeyTypeSQL("SPROLE") + ")), ESTIMATION "
	+ " from SALESPROJECT where 1=1 "+condition+" order by PHASE DESC", a.SQL_COMPLETE);

for (var i = 0; i < tab.length; i++ )
{
	// ermittelt die Anzahl Tage seit dem letzten Aktivkontakt im Vertriebsprojekt (Object=16, Medium=1,2,8)
	var x = a.sql("select max(ENTRYDATE) from HISTORY join HISTORYLINK on HISTORYID = HISTORYLINK.HISTORY_ID "
	+" where MEDIUM in (1,2,8) and OBJECT_ID = 16 and ROW_ID = '" + tab[i][0] + "'");
	if (x == '') tab[i][7] = "";
	else
	{
		var dauer = (a.valueof("$sys.today")	- date.dateToLong(date.longToDate(x))) / date.ONE_DAY
		tab[i][7] = dauer + 1;
	}
	var risksum = a.decodeMS(tab[i][9]);
	if (risksum.length > 0)
	{
		var rating = 0;
		for (j=0; j<risksum.length; j++) rating = rating + parseInt(a.sql("select KEYDETAIL from KEYWORD where " + getKeyTypeSQL("RISK") + " and KEYVALUE = " + risksum[j]));
		if (rating < 2) tab[i][1] = -3342439;
		if (rating >= 2 && rating < 6) tab[i][1] = -52;
		if (rating >= 6) tab[i][1] = -26215;
	}

	tab[i][3] = a.translate(tab[i][3]);
	tab[i][4] = a.translate(tab[i][4]);
}

a.ro(tab);