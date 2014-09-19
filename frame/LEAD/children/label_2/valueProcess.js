import("lib_lead");

var datafields = a.valueofObj("$image.LeadFields");
var pFieldValues = a.sql("select " + datafields.join(", ") + " from LEAD where LEADID = '" +  a.valueof("$comp.LEADID") + "'", a.SQL_ROW );
a.imagevar("$image.LeadValues", SetValues( datafields, a.valueofObj("$image.FielDev"), pFieldValues ));

var status = a.valueof("$comp.STATUS");
if (status != "")
    a.rs( GetLeadStatusText( parseInt( status ), 1 ));
else
    a.rs("");