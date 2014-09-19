import("lib_product");
import("lib_linkedFrame");

// Textblock speichern
saveTextblock( a.valueof("$comp.PRODUCTID"), a.valueof("$comp.cbx_Sprache") );

// Schliessen, Speichern, Aktualisieren von Superframe
swreturn();