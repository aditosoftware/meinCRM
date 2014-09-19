import("aditoTreeTable");
import("aditoTreeTableAdditional");
import("lib_keyword");
import("lib_util");
import("lib_sql");

var groupfields = [[yearfromdate("ORDERDATE")], [getKeySQL("GroupCode", "GROUPCODEID")], [" ITEMNAME"]];
var fields = [ ["case when ordertype = 2 and SENT = 'Y' and CANCELLED = 'N' then sum(QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100)  "
+ "  when ordertype = 3 and SENT = 'Y' and CANCELLED = 'N' then sum((QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100) * -1)  else 0 end"], 
["case when ordertype = 2 and SENT = 'Y' and CANCELLED = 'N' then sum(QUANTITY) when ordertype = 3 and SENT = 'Y' and CANCELLED = 'N' then ( sum(QUANTITY) * -1) else 0 end"] ];

if(fields.length > 0 && groupfields.length > 0 && a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW) 
{
    
    var sqlstr = "select " + monthfromdate("ORDERDATE") + ", " + fields.join(", ") + ", " + groupfields.join() 
    + " from ORDERITEM join SALESORDER on SALESORDERID = ORDERITEM.SALESORDER_ID "
    + " join RELATION on RELATION.RELATIONID = RELATION_ID join ORG on ORGID = RELATION.ORG_ID "
    + " join RELATION ORGREL on ORGREL.ORG_ID = RELATION.ORG_ID and ORGREL.PERS_ID is null "
    + " join ADDRESS on ADDRESSID = ORGREL.ADDRESS_ID"
    + " where ORGREL.ORG_ID = '" + a.valueof("$comp.orgid") +"' and ( ORDERTYPE = 2 or ORDERTYPE = 3 ) and SENT = 'Y' and CANCELLED = 'N'"
    + " group by " + groupfields.join() + ", " + monthfromdate("ORDERDATE") + ", ORDERTYPE, SENT, CANCELLED order by " + groupfields.join(" desc, ") + " desc";

    var data = a.sql( sqlstr, a.SQL_COMPLETE );
    var tree = {};
    tree[""] = {
        ids:[]
    };
    for ( var i = 0; i < data.length; i++)
    {   
        for ( var gi = 0; gi < groupfields.length; gi++ )
        {   
            var key = [];
            for( var ki = 0; ki <= gi; ki++ ) key.push(data[i][ki + fields.length + 1]);
            var id = a.encodeMS( key );
            var parentid = a.encodeMS( key.slice(0, key.length - 1));
            if (tree[parentid] == undefined)    tree[parentid] = {
                ids:[]
            };        
            if (tree[id] == undefined)
            {    
                tree[id] = {
                    ids:[], 
                    data: [[a.translate(data[i][fields.length + gi + 1]), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]]
                };
                tree[parentid].ids.push(id);
            }
            var row = parseInt(data[i][0]);
            for ( fi = 0; fi < fields.length; fi++)
            {
                if (tree[id]["data"][fi] == undefined ) tree[id]["data"].push( ["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ])
                tree[id]["data"][fi][row] += parseFloat(data[i][fi+1]);
                tree[id]["data"][fi][13] += parseFloat(data[i][fi+1]);
            }
        }
    }

    var getCellFn = function(id, colIndex) 
    {
        if (colIndex == 0)  return new ACell(new AData(tree[id].data[0][colIndex])); 
        else 
        {
            var data = [];
            for ( var i = 0; i < tree[id].data.length; i++)
                data.push(new AData(tree[id].data[i][colIndex], "NUMBER", "#,##0", null, null, 1));
            return new ACell(data, null,  colIndex == 13 ? -3355444 : null, null, 1);
        }
    }

    var getChildFn = function(id, index) 
    { 
        return tree[id].ids[index];
    }

    var getChildCountFn = function(id) 
    {
        return tree[id].ids.length;
    }

    var getIdFn = function(id) 
    {
        return id;
    }
    
    var getIconFn = function(id) 
    {
    }

    var getOpenFn = function(id) 
    {
    }


    var treeTable = buildTreeTable("", 14, getCellFn, getChildFn, getChildCountFn, getIdFn, getIconFn, getOpenFn);
    var colnames = ["Jan", "Feb", "März", "April", "Mai", "Juni", "Juli", "August", "Sept", "Okt", "Nov", "Dez", "Summe"];
    var zusatz = ["Umsatz", "Absatz"]
    treeTable.header = [ new AHeaderCell([new AData(a.translate("Gruppe"))], 160) ]
    for ( i = 0; i < colnames.length; i++)
    {
        var bez = [ new AData(a.translate(colnames[i])) ];
        for ( y = 0; y < zusatz.length; y++)   bez.push(new AData(a.translate(zusatz[y])));
        treeTable.header.push(new AHeaderCell(bez, 60));
    }
    treeTable.header.push(new AHeaderCell([ new AData("") ], 0));
    a.ro(treeTable);
}