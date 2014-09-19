var eval0 = a.valueofObj("$image.evaluation")[0];
var eval2 = a.valueofObj("$image.evaluation")[2];
if (eval0 != '' && eval2 != '' && eval0 != 0) a.rs( eval2 / eval0 );
else a.rs("0");