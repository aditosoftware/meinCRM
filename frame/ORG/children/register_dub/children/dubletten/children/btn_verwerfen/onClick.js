var relid = a.decodeFirst(a.valueof("$comp.tbl_dubletten"));
a.imagevar("$image.dupids", "");
if ( relid != "")
{
    a.doAction(ACTION.FRAME_CANCEL);
    a.doAction(ACTION.FRAME_NEWSELECTION);
    a.setImageCondition("RELATIONID = '" + relid + "'");
}