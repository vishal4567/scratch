//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017  GRAYPE Systems Private Limited
//
//     This file is part of “wink-utils”.
//
//     “wink-utils” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-utils” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-utils”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// Load wink helpers for object to array conversion & sorting.
var helpers = require( 'wink-helpers' );

// ### freqTable
/**
 *
 * It is a higher order function that returns an object containing `build()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `build()` to construct a frequency table from value of data items passed to it in real-time.
 * Probe the object containing data-item/frequency pairs using `value()`, which may be reset via `reset()`.
 *
 * The `result()` returns an object containing the frequency `table` sorted in descending order of category counts or frequency, along
 * with it's `size`, `sum` of all counts, `x2` - chi-squared statistic, `df` - degree of freedom, and the
 * `entropy`.
 *
 * The `x2` along with the `df` can be used test the hypothesis that "the distribution is a uniform one". The
 * `percentage` in `table` give the percentage of a category count against the `sum`; and `expected` is the count
 * assuming an uniform distribution.
 *
 * @name streaming.freqTable
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var ft = freqTable();
 *ft.build( 'Tea' );
 *ft.build( 'Tea' );
 *ft.build( 'Tea' );
 *ft.build( 'Tea' );
 *ft.build( 'Tea' );
 *ft.build( 'Tea' );
 *ft.build( 'Tea' );
 *ft.build( 'Pepsi' );
 *ft.build( 'Pepsi' );
 *ft.build( 'Gin' );
 *ft.build( 'Coke' );
 * ft.value();
 * // returns { Tea: 7, Pepsi: 2, Gin: 1, Coke: 2 }
 * ft.result();
 * // returns {
 * //  table: [
 * //   { category: 'Tea', observed: 7, percentage: 58.333333333333336, expected: 3 },
 * //   { category: 'Pepsi', observed: 2, percentage: 16.666666666666664, expected: 3 },
 * //   { category: 'Coke', observed: 2, percentage: 16.666666666666664, expected: 3 },
 * //   { category: 'Gin', observed: 1, percentage:  8.333333333333332, expected: 3 }
 * //  ],
 * //  size: 4,
 * //  sum: 12,
 * //  x2: 7.333,
 * //  df: 3,
 * //  pvalmin: 0.05,
 * //  pvalmax: 0.1,
 * //  entropy: 1.6140054628542204
 * // }
 */
var freqTable = function () {
  var obj = Object.create( null );
  var methods = Object.create( null );
  var sum = 0;

  methods.build = function ( x ) {
    obj[ x ] = 1 + ( obj[ x ] || 0 );
    sum += 1;
    return undefined;
  }; // compute()

  methods.value = function () {
    return obj;
  }; // value()

  methods.result = function () {
    var t = helpers.object.table( obj );
    var imax = t.length;
    var table = new Array( imax );
    var expectedVal = sum / imax;
    var x2 = 0;
    var entropy = 0;
    var p;
    var diff;
    var ft = Object.create( null );
    var pvaltable = [
      [ 0.5 , 0.1 , 0.05 , 0.02 , 0.01 ],
      [ 0.455 , 2.706 , 3.841 , 5.412 , 6.635 ],
      [ 1.386 , 4.605 , 5.991 , 7.824 , 9.210 ],
      [ 2.366 , 6.251 , 7.815 , 9.837 , 11.345 ],
      [ 3.357 , 7.779 , 9.488 , 11.668 , 13.277 ],
      [ 4.351 , 9.236 , 11.070 , 13.388 , 15.086 ],
    ];
    var pvalmax = 1;
    var pvalmin = 0.0;
    t.sort( helpers.array.descendingOnValue );
    for ( var i = 0;  i < imax; i += 1 ) {
      table[ i ] = Object.create( null );
      table[ i ].category = t[ i ][ 0 ];
      table[ i ].observed = t[ i ][ 1 ];
      p = t[ i ][ 1 ] / sum;
      table[ i ].percentage = ( p * 100 );
      table[ i ].expected = expectedVal;
      diff = ( t[ i ][ 1 ] - expectedVal );
      x2 += ( diff * ( diff / expectedVal ) );
      entropy += -p * Math.log2( p );
    }

    ft.table = table;
    ft.size = imax;
    ft.sum = sum;
    ft.x2 = +x2.toFixed( 3 );
    ft.df = ( imax - 1 );
    for ( var j = 0; j < 5; j += 1) {
      if (pvaltable[ imax - 1][ j ] > x2) {
        pvalmin = pvaltable[ 0 ][ j ];
        break;
      } else {
        pvalmax = pvaltable[ 0 ][ j ];
      }
    }
    ft.pvalmin = pvalmin;
    ft.pvalmax = pvalmax;
    ft.entropy = entropy;
    return ft;
  }; // result()

  methods.reset = function () {
    obj = Object.create( null );
    sum = 0;
  }; // reset()

  methods.compute = methods.build;
  return methods;
}; // freqTable()

module.exports = freqTable;
