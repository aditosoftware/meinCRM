import("lib_keyword");
import("lib_sql");

var id = a.valueof("$comp.idcolumn");
var condition = "";
var value = new Array();
var names = new Array();
var color = new Array();
var colorarray = new Array("-10391675", "-10843509", "-2601916", "-12698293", "-5190951", "-13152943", "-4270903", "-7722452", "-1206958");

var sqlA = "select DAYS from SPCYCLE where SALESPROJECT_ID = '" + id + "' and STATUSPHASE = 'Phase' and ";//"select count(SALESPROJECTID) from SALESPROJECT where ";
var phasearray = getValueList("SPPHASE");
var statusarray = getValueList("SPSTATUS");

switch(a.valueof("$comp.rb_statusphase"))
{
	case "Phase":
		for (i=0; i<phasearray.length; i++)
		{
			names.push( phasearray[i][1] );
			var val =  a.sql(sqlA + " KEYVAL = " + phasearray[i][0] + condition); if (val == '') val = 0;
			value.push( val );
			color.push(colorarray[i]);
		}
	break;
	
	case "Status":
		for (i=0; i<statusarray.length; i++)
		{
			names.push( statusarray[i][1] );
			var val =  a.sql(sqlA + " KEYVAL = " + statusarray[i][0] + condition); if (val == '') val = 0;
			value.push( val );
			color.push(colorarray[i]);
		}
	break;
}
a.ro([value, names, color]);