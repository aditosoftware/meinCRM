var offerid = a.valueof("$comp.OFFER_ID")
if(offerid != "")
    a.openFrame("OFFER", "OFFERID = '" + offerid + "'", false, a.FRAMEMODE_SHOW);