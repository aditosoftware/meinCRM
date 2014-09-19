var incNoAc = a.translate("Eingehend, nicht angenommen");
var incAc = a.translate("Eingehend, angenommen");
var outNoAc = a.translate("Ausgehend, nicht angenommen");
var outAc = a.translate("Ausgehend, angenommen");

var res = [ [ "0", incNoAc ] 
, [ "1", incAc ]
, [ "2", outNoAc ]
, [ "4", outAc ]          
];
a.ro(res);