import("aditoTreeTable");
import("aditoTreeTableAdditional");
import("lib_keyword");
import("lib_util");
import("lib_sql");

var groupfields = a.decodeMS(a.valueof("$comp.Gruppe"));
var fields = a.decodeMS(a.valueof("$comp.Fields"));
var fielddef = a.valueofObj("$image.fields");
if(fields.length > 0 && groupfields.length > 0 && a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT) 
{
    
    var sqlstr = "select " + monthfromdate("ORDERDATE") + ", " + fields.join(", ") + ", " + groupfields.join() 
    + " from ORDERITEM join SALESORDER on SALESORDERID = ORDERITEM.SALESORDER_ID "
    + " join RELATION on RELATION.RELATIONID = RELATION_ID join ORG on ORGID = RELATION.ORG_ID "
    + " join RELATION ORGREL on ORGREL.ORG_ID = RELATION.ORG_ID and ORGREL.PERS_ID is null "
    + " join ADDRESS on ADDRESSID = ORGREL.ADDRESS_ID where ordertype = 2 and SENT = 'Y' and CANCELLED = 'N'"
    + " group by " + groupfields.join() + ", " + monthfromdate("ORDERDATE") + ", ORDERTYPE, SENT, CANCELLED order by " + groupfields.join(", ");

    var data = a.sql( sqlstr, a.SQL_COMPLETE );
    var tree = {};
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
                    data: [{
                        values:_initData(a.translate(data[i][fields.length + gi + 1])), 
                        format:  _getformat(0)
                    }]
                };
                tree[parentid].ids.push(id);
            }
            var col = Number(data[i][0]);
            for ( fi = 0; fi < fields.length; fi++)
            {
                if (tree[id]["data"][fi] == undefined ) tree[id]["data"].push( {
                    values: _initData(""), 
                    format: _getformat(fi)
                } );                
                tree[id]["data"][fi].values[col] += Number(data[i][fi+1]);
                tree[id]["data"][fi].values[13] += Number(data[i][fi+1]);
            }
        }
    }
    a.imagevar("$image.UmsatzTree", tree);
    
    var getCellFn = function(id, colIndex) 
    {
        var data = [];
        if (colIndex == 0)  data.push(new AData(tree[id].data[0].values[colIndex])); 
        else 
        {
            for ( var i = 0; i < tree[id].data.length; i++)
                data.push(new AData(tree[id].data[i].values[colIndex], "NUMBER", tree[id].data[i].format, null, null, 1));
        }
        return new ACell(data, null,  colIndex == 13 ? -3355444 : null, null, colIndex == 0 ? 0 : 1);
    }

    var getChildFn = function(id, index) 
    {
        return tree[id].ids[index];
    }

    var getChildCountFn = function(id) 
    {
        if (tree[id] == undefined ) return 0;
        else    return tree[id].ids.length;
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
    treeTable.header = [ new AHeaderCell([new AData(a.translate("Gruppe"))], 160) ]
    for ( i = 0; i < colnames.length; i++)  
        treeTable.header.push(new AHeaderCell([new AData(a.translate(colnames[i]))], 60));

    a.ro(treeTable);
}

function _initData(pDescription)
{
    
    return [pDescription, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
}

function _getformat( pZeile )
{
    var ret = "";
    var feld = fields[pZeile];
    for ( var zi = 0; zi < fielddef.length; zi++)
    {
        if ( feld == fielddef[zi][0] )
        {
            if ( fielddef[zi][1].indexOf("Absatz") > -1 )   ret = "#,##0 'St.'";            
            else if ( fielddef[zi][1].indexOf("Rabatt") > -1 )   ret = "#,##0 '%'";
            else ret = "#,##0 '€'";
            break;        
        }
    }
    return ret;
}