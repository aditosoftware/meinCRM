import("aditoTreeTable");
import("aditoTreeTableAdditional");
import("lib_modul");
import("lib_util");

var obj = []; 
var ids = [];
var orgids = [];
var persids = [];
var condition = [];
var icons = [];
var historyid = a.valueof("$comp.historyid");
var data = a.sql("SELECT DESCRIPTION, ID FROM ASYS_ICONS WHERE ICON_TYPE = 'Modul'", a.SQL_COMPLETE);

for ( i = 0; i < data.length; i++ )  icons[data[i][0]] = data[i][1];

data = new FrameData().getData("history", true, ["name", "title", "table", "idcolumn"]); // Frames für Historylink
for ( i = 0; i < data.length; i++ )  obj.push( a.encodeMS( [data[i][0], a.translate( data[i][1] ), data[i][2], data[i][3]] ));

data = a.getTableData("$comp.Tabelle_hlink", a.ALL);
for ( i = 0; i < data.length; i++ )     if (data[i][1] == "3")   ids.push(data[i][2]);
data = a.sql("select PERS_ID, ORG_ID from RELATION where RELATIONID in ('" + ids.join("', '") + "')", a.SQL_COMPLETE);

for ( i = 0; i < data.length; i++ )
{
    if ( data[i][0] != "" && !hasElement(persids, data[i][0]) )   persids.push(data[i][0]);
    if ( data[i][1] != "0" && data[i][1] != "1" && !hasElement(orgids, data[i][1]) )  orgids.push(data[i][1]);
}
if ( persids.length > 0 )    condition.push("PERS_ID in ('" + persids.join("','") + "')");
if ( orgids.length > 0 )    condition.push("ORG_ID in ('" + orgids.join("','") + "')");

data = getModule(condition.join(" or "), obj);

var tree = {};
tree[""] =  { ids: [] };
for ( i = 0; i < data.length; i++)
{   
    var parentid = a.encodeMS([data[i][1]])
    if ( tree[parentid] == undefined )   
    {    
        tree[parentid] =  { data: [[data[i][2]]], ids: [] };
        tree[""].ids.push(parentid)
    }
    tree[data[i][0]] =  { data: [ data[i].slice(2) ], ids: [] };
    tree[parentid].ids.push(data[i][0]);
}

var getCellFn = function(id, colIndex) 
{
    data = "";
    if ( a.decodeMS(id).length == 1 && colIndex == 0 )  data = new AData(tree[id].data[0][0], null, null, null, null, 0 );
    else if ( a.decodeMS(id).length > 1 && colIndex == 1 )
         {  
             data = ( tree[id].data[0][2] != "" ? tree[id].data[0][2] + " - " : "" ) + tree[id].data[0][3]
             data = [ new AData(data , null, null, null, null, 0),
                        new AData(tree[id].data[0][1], null, null, null, null, 0)];
         }
         else if ( a.decodeMS(id).length > 1 && colIndex == 0 )
             {
                 data = new AData(tree[id].data[0][4], "TIME", "dd.MM.yyyy" );
             }
return new ACell(data);
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
    var icon = null;
    id = a.decodeMS(id);
    if ( id.length == 1 )  icon = icons[id[0]];
    return icon;
}

var getTreeOpen = function(id) 
{
    return false;
}

var treeTable = buildTreeTable("", 4, getCellFn, getChildFn, getChildCountFn, getIdFn, getIconFn, getTreeOpen);
treeTable.header = [ new AHeaderCell([new AData(a.translate("Modul"))], 120),
                     new AHeaderCell([new AData(a.translate("Info"), null, null, null, null, 0)], 150) ];

a.ro(treeTable);