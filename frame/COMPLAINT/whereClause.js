import("lib_grant");
import("lib_frame");

// Leserechte holen
var condition = "";
a.rs( getGrantCondition(a.valueof("$sys.currentimagename"), condition ));