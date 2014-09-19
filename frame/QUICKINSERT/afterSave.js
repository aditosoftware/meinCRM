if ( a.hasvar("$image.relorgid"))   a.openFrame("ORG", "RELATIONID = '" + a.valueof("$image.relorgid") + "'", false, a.FRAMEMODE_SHOW);
else  a.openFrame("PERS", "RELATIONID = '" + a.valueof("$image.relpersid") + "'", false, a.FRAMEMODE_SHOW);
a.closeCurrentTopImage();