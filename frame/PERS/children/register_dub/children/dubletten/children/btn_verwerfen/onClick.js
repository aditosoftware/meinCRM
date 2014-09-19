var pid = a.decodeFirst(a.valueof("$comp.tbl_dubletten"));

var condition = "RELATION.RELATIONID = '" + pid + "'";
a.imagevar("$image.dupids", "");
a.doAction(ACTION.FRAME_CANCEL);
if ( pid != "")
{
    if ( a.valueof("$sys.superframe") == 'ORG' )
    {
        a.closeCurrentTopImage();
        a.openFrame("PERS", condition, false, a.FRAMEMODE_SHOW, null, true); //ckecked by BH-090312		
    }
    else
    {
        a.doAction(ACTION.FRAME_NEWSELECTION);
        a.setImageCondition("RELATIONID = '" + pid + "'");
    }
}