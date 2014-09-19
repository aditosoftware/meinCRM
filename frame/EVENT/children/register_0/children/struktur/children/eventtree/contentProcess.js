var nodeid = a.valueof("$local.nodeid");
var icons = a.sql("select ID, DESCRIPTION from ASYS_ICONS where ICON_TYPE = 'Eventtree'", a.SQL_COMPLETE);
var iconskey = [];
for ( var i = 0; i < icons.length; i++ )	iconskey[icons[i][1]] = icons[i][0];
if ( !a.hasvar("$image.treeopen") ) a.imagevar("$image.treeopen", true)
var result = [];
var condition;

if (nodeid == null)
{
    var relid = getRootID ( a.valueof("$comp.EVENTID") )
    condition = " EVENT_ID is null and EVENTID = '" + relid + "'";
}
else
{
    condition = " EVENT_ID = '" + nodeid + "'";
}
var event = a.sql("select EVENTID, TITLE, DESCRIPTION from EVENT where " + condition + " order by TITLE", a.SQL_COMPLETE);
for (i = 0; i < event.length; i++)
{
    var isleaf = false;
    var icon = null; // iconskey[1];//else icon = iconskey[2];
    if ( a.sql("select count(*) from EVENT where EVENT_ID = '" + event[i][0] + "'") == 0 )	
    {
        isleaf = true;
        icon = iconskey[0];
    }
    //										nodeID 	   displayValue 		tooltip	        icon 	isLeaf 	parentID, autoOpen
    result.push([ event[i][0], event[i][1], event[i][2], icon, isleaf, nodeid,  a.valueof("$image.treeopen") ])
}
a.ro(result)
	
function getRootID ( pRelationID )
{
    var sourceid = pRelationID;
    do
    {
        var rootid = sourceid;
        sourceid = a.sql("select EVENT_ID from EVENT where EVENTID = '" + sourceid + "'");
    }
    while( sourceid != "" )
    //	a.imagevar("$image.rootid", rootid);
    return rootid; 
}