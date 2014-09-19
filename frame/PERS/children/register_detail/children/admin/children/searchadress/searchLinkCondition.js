import("lib_keyword");

// Suchen in Vornamen, Nachnamen, Firmenname, Email, Straße oder Ort

var operator = ["","=","!=",">","<","<=",">=","like","not like","","","is not","is"];
var op = Number(a.valueof("$local.operator"));
var cond = " " + operator[op] + " ? ";
var value = a.valueof("$local.rawvalue");
var i;

// AdditionalCharSearch nur bei MSSQL
if ( a.getDatabaseType(a.valueof("$sys.dbalias")) == a.DBTYPE_SQLSERVER2000 )
{
    var addchar = getKeyList( "AdditionalCharSearch", ["KEYNAME1","KEYNAME2"]);
    for ( i = 0; i < addchar.length; i++ )	value = value.replace( new RegExp(addchar[i][0], "g"), "[" + addchar[i][1] + "]" );
    cond = " " + operator[Number(a.valueof("$local.operator"))] + " ?";
}

if ( op == 7 || op == 8 )  value = "%" + value + "%";
var params = [];
for ( i = 0; i < 6; i++ )
    params.push([value, SQLTYPES.VARCHAR]);

var stmt = ("PERS.LASTNAME" + cond + " or PERS.FIRSTNAME" + cond + " or ADDRESS.ADDRESS" + cond + " or ADDRESS.CITY" + cond
    + " or RELATION.RELATIONID in (select RELATION_ID from COMM where MEDIUM_ID = 3 and ADDR" + cond + ")"
    + " or RELATION.ORG_ID in (select ORGID from ORG where ORG.ORGNAME" + cond + ")" );

a.ro([stmt, params]);