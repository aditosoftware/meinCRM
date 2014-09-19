var eval0 = a.valueofObj("$image.evaluation")[0];
var eval1 = a.valueofObj("$image.evaluation")[1];
if (eval0 != '' && eval1 != '' && eval0 != 0) a.rs( eval1 / eval0 );
else a.rs("0");