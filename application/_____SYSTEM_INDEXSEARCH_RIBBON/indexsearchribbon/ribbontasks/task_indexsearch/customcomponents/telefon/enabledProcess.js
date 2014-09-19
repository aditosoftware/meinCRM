var keys = a.valueofObj("$sys.selection");
a.rs( keys != undefined && keys.length == 1 && ( keys[0]["#ADITO_SEARCH_TYPE"] == "PERS" || keys[0]["#ADITO_SEARCH_TYPE"] == "ORG" ) )