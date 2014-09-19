var row = a.valueofObj("$local.rowdata");

var component = null

switch( row[1] )
{
    case "1":
    case "2":
    case "3":
        component = "$comp.lup_REL"	
        break;
    case "6":
        component = "$comp.lup_CAMPAIGN"	
        break;
    case "13":
        component = "$comp.lup_COMPLAINT"	
        break;
    case "16":
        component = "$comp.lup_SALESPROJECT"	
        break;
    case "31":
        component = "$comp.lup_EVENT"	
        break;
    case "33":
        component = "$comp.lup_CONTRACT"	
        break;
    case "50":
        component = "$comp.lup_PROPERTY"	
        break;
    case "51":
        component = "$comp.lup_MACHINE"	
        break;
    case "52":
        component = "$comp.lup_SERVICEORDER"	
        break;
}
a.rs( component );