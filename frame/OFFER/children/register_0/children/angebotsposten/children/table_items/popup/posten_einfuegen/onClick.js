import("lib_offerorder");

var position = getNewPosition( a.decodeFirst(a.valueof("$comp.Table_Items")), "OFFERITEM", "OFFER_ID = '" + a.valueof("$comp.OFFERID") + "'");

NewOfferPosition(position);