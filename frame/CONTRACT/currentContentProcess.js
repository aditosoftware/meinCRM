import("lib_keyword");

var contracttype = getKeyName(a.valueof("$comp.CONTRACTTYPE"), "CONTRACTTYPE");

a.rs(contracttype + " : " + a.valueof("$comp.CONTRACTCODE"));