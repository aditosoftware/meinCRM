import("lib_lead");
import("lib_duplicate");

var tabelle =  a.createEmptyTable(4);
var dupids = hasOrgDuplicates( "", getOrgLeadPattern( a.valueofObj("$image.LeadValues"), a.valueofObj("$image.DubParam") ) );
if (dupids.length > 0)    tabelle = getDuplicates("ORG", dupids);

a.ro(tabelle);