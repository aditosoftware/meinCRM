import("aditoTreeTable");
import("aditoTreeTableAdditional");
import("lib_keyword");
import("lib_util");
import("lib_sql")

var groupfields = [yearfromdate("SPFORECAST.STARTDATE"), getKeySQL("GroupCode", "GROUPCODEID"), "PROJECTTITLE", "SALESPROJECTID"];
var fields = ["sum(SPFORECAST.VOLUME * PROBABILITY) / 100 "];
var sqlstr = "select " + monthfromdate("SPFORECAST.STARTDATE") + ", " + fields.join(", ") + ", " + groupfields.join() 
+ " from SPFORECAST join SALESPROJECT on SALESPROJECTID = SALESPROJECT_ID  "
+ " group by " + groupfields.join(", ") + ", " + monthfromdate("SPFORECAST.STARTDATE") + " order by " + groupfields.join(", ");

if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT )
{
    var data = a.sql( sqlstr, a.SQL_COMPLETE );
    var tree = {};
    for ( var i = 0; i < data.length; i++)
    {   
        // Gruppenwechsel
        for ( var gi = 0; gi < groupfields.length -1; gi++ )
        {   
            var key = [];
            for( var ki = 0; ki <= gi; ki++ ) key.push(data[i][ki + fields.length + 1]);
            if ( gi == 2 )  // SALESPROJECTID mit in den Key um das Projekt zu öffnen
            {           
                key.push(data[i][fields.length + groupfields.length]);  
                var id = a.encodeMS( key );
                var parentid = a.encodeMS( key.slice(0, key.length - 2));
            }
            else
            {
                var id = a.encodeMS( key );
                var parentid = a.encodeMS( key.slice(0, key.length - 1));
            }            
            
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
            var row = Number(data[i][0]);
            for ( fi = 0; fi < fields.length; fi++)
            {
                if (tree[id]["data"][fi] == undefined ) tree[id]["data"].push( ["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ])
                tree[id]["data"][fi][row] += Number(data[i][fi+1]);
                tree[id]["data"][fi][13] += Number(data[i][fi+1]);
            }
        }
    }
    var getCellFn = function(id, colIndex) 
    {
        if (colIndex == 0)  return new ACell(new AData(tree[id].data[0][colIndex])); 
        else 
        {
            var data = [];
            data.push(new AData(tree[id].data[0][colIndex], "NUMBER", "#,##0 'T€'", null, null, 1));
            return new ACell(data, null, colIndex == 13 ? -3355444 : null, null, 1);
        }
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
    var colnames = ["Jan", "Feb", "März", "April", "Mai", "Juni", "Juli", "August", "Sept", "Okt", "Nov", "Dez", "Summe"];
    treeTable.header = [ new AHeaderCell([new AData(a.translate("Gruppe"))], 200) ]
    for ( i = 0; i < colnames.length; i++)  
        treeTable.header.push(new AHeaderCell([new AData(a.translate(colnames[i]))], 55 ));
    a.ro(treeTable);
}
