var Result = [];
getEintrag ( "", Result, 0 );

a.ro( Result )

function getEintrag( pThemeID, pResult, pLevel )
{
    var condition = " THEME_ID = '" + pThemeID + "'"
    if ( pThemeID == "") condition = " THEME_ID is null"
		
    var theme = a.sql("select THEMEID, THEME from THEME where ISACTIVE = 1 and " + condition + " order by THEMESORT", a.SQL_COMPLETE);
    for ( var i = 0; i < theme.length; i++)
    {
        var distance = "";
        for ( var z = 0; z < pLevel; z++ ) distance += " - "
        pResult.push( [ theme[i][0], distance +  theme[i][1] ] );
        getEintrag(  theme[i][0], pResult, pLevel + 1 );
    }
}