import("lib_lead");
import("lib_duplicate");

var tabelle =  a.createEmptyTable(5);
var dupids = hasPersDuplicates( "", "", getPersLeadPattern( a.valueofObj("$image.LeadValues"), a.valueofObj("$image.DubParam") ) );
if (dupids.length > 0)    tabelle = getDuplicates("PERS", dupids);

a.ro(tabelle);