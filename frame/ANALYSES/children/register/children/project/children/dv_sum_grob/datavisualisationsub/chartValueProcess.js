import("lib_keyword");
import("lib_sql");

var condition = "";
var value = new Array();
var names = new Array();
var color = new Array();
var colorarray = new Array("-10391675", "-10843509", "-2601916", "-12698293", "-5190951", "-13152943", "-4270903", "-7722452", "-1206958");
var status = a.valueof("$comp.Combobox_Status"); if (status != '') condition += " AND STATUS = " + status;
var phase = a.valueof("$comp.Combobox_Phase"); if (phase != '') condition += " AND PHASE = " + phase;
var volOp = a.valueof("$comp.Combobox_Vol");
var vol = a.valueof("$comp.Edit_Vol");
	if (volOp != '' && vol != '') condition += " AND VOLUME "+volOp+vol;
var von = a.valueof("$comp.Edit_von"); 
	if (von != '') condition += " AND " + getTimeCondition("STARTDATE", ">", von, "AO_DATEN");
var bis = a.valueof("$comp.Edit_bis"); 
	if (bis != '') condition += " AND " + getTimeCondition("STARTDATE", "<", bis, "AO_DATEN")
var pm = a.valueof("$comp.Combobox_ProjManager"); 
	if (pm != '') condition += " AND SALESPROJECTID in (select SALESPROJECT_ID from SPMEMBER where RELATION_ID = '"+pm+"')";

var phasearray = getValueList("SPPHASE");

switch(a.valueof("$comp.rb_grob_fein"))
{
	case "1": // Anzahl / Phase
		for (i=0; i<phasearray.length; i++)
		{
			names.push( phasearray[i][1] );
			var val =  a.sql("select count(SALESPROJECTID) from SALESPROJECT where PHASE = " + phasearray[i][0] + condition); if (val == '') val = 0.001;
			value.push( val );
			color.push(colorarray[i]);
		}
	break;
	case "2": // T€ / Phase
		for (i=0; i<phasearray.length; i++)
		{
			names.push( phasearray[i][1] );
			value[i] = a.sql("select sum(VOLUME) from SALESPROJECT where PHASE = " + phasearray[i][0] + condition); if (value[i] == '') value[i] = 0.001;
			color[i] = colorarray[i]
		}
	break;
	case "3": // Laufzeit / Phase
		for (i=0; i<phasearray.length; i++)
		{
			names.push( phasearray[i][1] );
			var val =  a.sql("select sum(DAYS) from SPCYCLE join SALESPROJECT on SALESPROJECTID = SALESPROJECT_ID "
				+ " where KEYVAL = " + phasearray[i][0] + " and STATUSPHASE = 'Phase' " + condition); 
			if (val == '') val = 0.001;
			else val = eMath.roundDec(val/30, 1, eMath.ROUND_HALF_EVEN)
			value.push (val) ;
			color.push (colorarray[i]);
		}
	break;

}
a.ro([value, names, color]);