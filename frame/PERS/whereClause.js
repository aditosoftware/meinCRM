import("lib_grant");

// Leserechte holen
a.rs( getGrantCondition( a.valueof("$sys.currentimagename"), "RELATION.PERS_ID = PERS.PERSID and ADDRESS.ADDRESSID = RELATION.ADDRESS_ID" ));