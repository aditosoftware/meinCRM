import("lib_sql")

var user = a.valueof("$sys.user");
var retdata = a.createEmptyTable(8);
var filterType = a.valueof("$comp.cmbTYPE");
var condition = " where 1=1";

if (filterType != "") 
    condition = " and SHIPSTATUS = " + filterType;

var sql = " select relationid, " + concat(["firstname", "lastname", "','", "orgname"]) + " , count(*) as Anzahl " + 
" from ADVERTISINGSHIPMENT " + 
//	          " left outer join keyword kw1 on (shipreason = kw1.keyvalue and kw1.keytype = 63) " + 
//	          " left outer join keyword kw2 on (shipstatus = kw2.keyvalue and kw2.keytype = 64) " + 
//	          " join product on (product_id = productid) " + 
" join relation on (ADVERTISINGSHIPMENT.RELATION_ID = relationid) " +
" join pers on (pers_id = persid)" + 
" join org on (relation.org_id = orgid)" + condition +
" group by relationid, orgname, firstname, lastname " + 
" order by orgname, lastname";
	          
a.rq(sql);