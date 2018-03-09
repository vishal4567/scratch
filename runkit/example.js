// Load Wink Statistics
var ws = require( 'wink-statistics' );
ws.stats.percentile( [ 1, 1, 2, 2, 3, 3, 4, 4 ], 0.25 );
// returns 1.25
var ft = ws.streaming.freqTable();
ft.build( 'Tea' );
ft.build( 'Tea' );
ft.build( 'Tea' );
ft.build( 'Tea' );
ft.build( 'Tea' );
ft.build( 'Tea' );
ft.build( 'Tea' );
ft.build( 'Pepsi' );
ft.build( 'Pepsi' );
ft.build( 'Gin' );
ft.build( 'Coke' );
ft.build( 'Coke' );
ft.value();
// returns { Tea: 3, Pepsi: 2, Gin: 1, Coke: 2 }
ft.result();
console.log(ft.result());
