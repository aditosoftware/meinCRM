import("lib_linkedFrame");
import("lib_offerorder");

if(a.valueof("$sys.workingmodebeforesave") == a.FRAMEMODE_NEW)      insertOfferPosition();
swreturn();