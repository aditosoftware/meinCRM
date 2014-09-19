if ( a.valueof("$global.upwardLink") == "link")
    a.openLinkedFrame("ORG", null, false, a.FRAMEMODE_SHOW, "$comp.Merge_RELATION_ID|RELATION.RELATIONID");
else
    a.openFrame("ORG", "RELATION.RELATIONID = '" + a.valueof("$comp.Merge_RELATION_ID") + "'", false, a.FRAMEMODE_SHOW, null, false); //checked by BH-090311