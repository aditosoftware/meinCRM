import("lib_sql");

var condition = "";

	var status = a.valueof("$comp.Combobox_Status"); if (status != '') condition += " AND STATUS = "+status;
	var phase = a.valueof("$comp.Combobox_Phase"); if (phase != '') condition += " AND PHASE = "+phase;
	var volOp = a.valueof("$comp.Combobox_Vol");
	var vol = a.valueof("$comp.Edit_Vol");
		if (volOp != '' && vol != '') condition += " AND VOLUME "+volOp+vol;
	var von = a.valueof("$comp.Edit_von"); 
		if (von != '') condition += " AND " + getTimeCondition("DATE_NEW", ">", von, "AO_DATEN");
	var bis = a.valueof("$comp.Edit_bis"); 
		if (bis != '') condition += " AND " + getTimeCondition("DATE_NEW", ">", bis, "AO_DATEN")
	var pm = a.valueof("$comp.Combobox_ProjManager"); 
		if (pm != '') condition += " AND SALESPROJECTID in (select SALESPROJECT_ID from SPMEMBER where RELATION_ID = '"+pm+"')";

a.rq("select count(*) from SALESPROJECT where 1=1 "+condition);