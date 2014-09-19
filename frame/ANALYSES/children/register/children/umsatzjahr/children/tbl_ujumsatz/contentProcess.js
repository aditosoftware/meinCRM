import("aditoTreeTable");
import("aditoTreeTableAdditional");
import("lib_keyword");
import("lib_util");
import("lib_sql");

var showyears = 4;
var actdate = a.valueof("$sys.today");
var actyear = Number( date.longToDate(actdate, "yyyy"));
var groupfields = a.decodeMS(a.valueof("$comp.UJGruppe"));
var fields = a.decodeMS(a.valueof("$comp.UJFields"));
var fielddef = a.valueofObj("$image.ujfields");
var geskey = a.encodeMS(["Gesamt"]);
if(fields.length > 0 && groupfields.length > 0 && a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT) 
{
    
    var sqlstr = "select ORDERDATE, " + fields.join(", ") + ", " + groupfields.join() 
    + " from ORDERITEM join SALESORDER on SALESORDERID = ORDERITEM.SALESORDER_ID "
    + " join RELATION on RELATION.RELATIONID = RELATION_ID join ORG on ORGID = RELATION.ORG_ID "
    + " join RELATION ORGREL on ORGREL.ORG_ID = RELATION.ORG_ID and ORGREL.PERS_ID is null "
    + " join ADDRESS on ADDRESSID = ORGREL.ADDRESS_ID where ordertype = 2 and SENT = 'Y' and CANCELLED = 'N'"
    + " and " + yearfromdate("ORDERDATE") + " > " + (actyear - showyears)
    + " group by " + groupfields.join() + ", ORDERDATE order by " + groupfields.join(", ");

    var data = a.sql( sqlstr, a.SQL_COMPLETE );
   
    var tree = {};
    
    tree[geskey] = {
        ids:[], 
        data: [ {
            values: _initData(a.translate("Gesamt")), 
            format: _getformat(0)
        }]
    }

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
                        values: _initData(a.translate(data[i][fields.length + gi + 1])), 
                        format: _getformat(0)
                        }]
                };
                tree[parentid].ids.push(id);
            }
            var row = actyear - Number( date.longToDate( data[i][0], "yyyy")) + 1;
            for ( fi = 0; fi < fields.length; fi++)
            {
                
                if (tree[id]["data"][fi] == undefined ) tree[id]["data"].push( {
                    values: _initData(""), 
                    format: _getformat(fi)
                    } );
                if (tree[geskey]["data"][fi] == undefined ) tree[geskey]["data"].push( {
                    values: _initData(""), 
                    format: _getformat(fi)
                    } );

                if ( fields[fi][0] != " " || date.longToDate(data[i][0],"MM") <= date.longToDate(actdate,"MM") )
                {
                    tree[id]["data"][fi].values[row] += Number(data[i][fi+1]);
                    tree[geskey]["data"][fi].values[row] += Number(data[i][fi+1]);
                }

            }
        }
    }
    
    if (tree[""] != undefined) tree[""].ids.push(geskey); 
    a.imagevar("$image.UJUmsatzTree", tree );
    
    var getCellFn = function(id, colIndex) 
    {
        var data = [];
        if (colIndex == 0)  data.push(new AData(tree[id].data[0].values[colIndex])); 
        else 
        {
            for ( var i = 0; i < tree[id].data.length; i++)
                data.push(new AData(tree[id].data[i].values[colIndex], "NUMBER", tree[id].data[i].format, null, null, 1));
        }
        return new ACell(data, null,  id == geskey ? -3355444 : null, null, colIndex == 0 ? 0 : 1);
    }

    var getChildFn = function(id, index) 
    {        
        return tree[id].ids[index];
    }

    var getChildCountFn = function(id) 
    {
        if (tree[id] == undefined ) return 0; 
        else return tree[id].ids.length;
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
    colnames = [];
    for ( i = 0; i < showyears; i++)   colnames.push(actyear-i) 
    
    treeTable.header = [ new AHeaderCell([new AData(a.translate("Gruppe"))], 200) ]
    
    for ( i = 0; i < colnames.length; i++)  
        treeTable.header.push(new AHeaderCell([new AData(a.translate(colnames[i]))], 100));
    treeTable.header.push(new AHeaderCell([new AData("")], 0));
    a.ro(treeTable);
}

function _getformat( pZeile )
{
    var ret = "#,##0 '€'";
    var feld = fields[pZeile];
    for ( var zi = 0; zi < fielddef.length; zi++)
    {
        if ( feld == fielddef[zi][0] && fielddef[zi][1].indexOf("Absatz") > -1 ) 
        {      
            ret = "#,##0 'St.'";
            break;
        }
    }
    return ret;
}

function _initData(pDescription)
{
    
    return [pDescription, 0, 0, 0, 0]
}