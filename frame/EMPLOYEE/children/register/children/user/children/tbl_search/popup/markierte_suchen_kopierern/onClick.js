import("lib_storedSearches" );
import("lib_util" );
import("lib_user");

var fromuser = a.valueof( "$comp.login" );
var searchlist = a.decodeMS( a.valueof( "$comp.tbl_search" ) );
var anz = 0;

var answer = a.askUserQuestion( a.translate( "Bitte wählen Sie eine Rolle oder einen User!" ), "DLG_CHOOSE_ROLES" );

if ( answer != null )
{
    var tousers = getUsersByRoles( answer[ "DLG_CHOOSE_ROLES.selection" ]);

    for ( var ui = 0; ui < tousers.length; ui++ )
    {
        if ( tousers[ui] != fromuser )
        { 
            for ( var si = 0; si < searchlist.length; si++ )
            {
                var search = a.decodeMS(searchlist[si]);
                clearStoredSearches( tousers[ui], search[0], search[1]);
                try
                {
                    transferSearch(fromuser, tousers[ui], search[0], search[1])
                    anz++;
                }catch(err)
                {
                    log.log(ex);
                }
            }
        }
    }
    a.showMessage( a.translate( "%0 gespeicherte Suchen kopiert", [anz] ));
}