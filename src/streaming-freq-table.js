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
 * //  pvalmax: 0.075,
 * //  pvalmin: 0.05,
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
      [ 0.2 , 0.1 , 0.075 , 0.05 , 0.025 , 0.010 , 0.005 , 0.001 , 0.0005 ],
      [ 1.642 , 2.706 , 3.170 , 3.841 , 5.024 , 6.635 , 7.879 , 10.828 , 12.116 ],
      [ 3.219 , 4.605 , 5.181 , 5.991 , 7.378 , 9.210 , 10.597 , 13.816 , 15.202 ],
      [ 4.642 , 6.251 , 6.905 , 7.815 , 9.348 , 11.345 , 12.838 , 16.266 , 17.731 ],
      [ 5.989 , 7.779 , 8.496 , 9.488 , 11.143 , 13.277 , 14.860 , 18.467 , 19.998 ],
      [ 7.289 , 9.236 , 10.008 , 11.070 , 12.833 , 15.086 , 16.750 , 20.516 , 22.106 ],
      [ 8.558 , 10.645 , 11.466 , 12.592 , 14.449 , 16.812 , 18.548 , 22.458 , 24.104 ],
      [ 9.803 , 12.017 , 12.883 , 14.067 , 16.013 , 18.475 , 20.278 , 24.322 , 26.019 ],
      [ 11.030 , 13.362 , 14.270 , 15.507 , 17.535 , 20.090 , 21.955 , 26.125 , 27.869 ],
      [ 12.242 , 14.684 , 15.631 , 16.919 , 19.023 , 21.666 , 23.589 , 27.878 , 29.667 ],
      [ 13.442 , 15.987 , 16.971 , 18.307 , 20.483 , 23.209 , 25.188 , 29.589 , 31.421 ],
      [ 14.631 , 17.275 , 18.294 , 19.675 , 21.920 , 24.725 , 26.757 , 31.265 , 33.138 ],
      [ 15.812 , 18.549 , 19.602 , 21.026 , 23.337 , 26.217 , 28.300 , 32.910 , 34.822 ],
      [ 16.985 , 19.812 , 20.897 , 22.362 , 24.736 , 27.688 , 29.820 , 34.529 , 36.479 ],
      [ 18.151 , 21.064 , 22.180 , 23.685 , 26.119 , 29.141 , 31.319 , 36.124 , 38.111 ],
      [ 19.311 , 22.307 , 23.452 , 24.996 , 27.488 , 30.578 , 32.801 , 37.698 , 39.720 ],
      [ 20.465 , 23.542 , 24.716 , 26.296 , 28.845 , 32.000 , 34.267 , 39.253 , 41.309 ],
      [ 21.615 , 24.769 , 25.970 , 27.587 , 30.191 , 33.409 , 35.719 , 40.791 , 42.881 ],
      [ 22.760 , 25.989 , 27.218 , 28.869 , 31.526 , 34.805 , 37.157 , 42.314 , 44.435 ],
      [ 23.900 , 27.204 , 28.458 , 30.144 , 32.852 , 36.191 , 38.582 , 43.821 , 45.974 ],
      [ 25.038 , 28.412 , 29.692 , 31.410 , 34.170 , 37.566 , 39.997 , 45.315 , 47.501 ],
      [ 26.171 , 29.615 , 30.920 , 32.671 , 35.479 , 38.932 , 41.401 , 46.798 , 49.013 ],
      [ 27.301 , 30.813 , 32.142 , 33.924 , 36.781 , 40.289 , 42.796 , 48.269 , 50.512 ],
      [ 28.429 , 32.007 , 33.360 , 35.172 , 38.076 , 41.639 , 44.182 , 49.729 , 52.002 ],
      [ 29.553 , 33.196 , 34.572 , 36.415 , 39.364 , 42.980 , 45.559 , 51.180 , 53.480 ],
      [ 30.675 , 34.382 , 35.780 , 37.653 , 40.646 , 44.314 , 46.928 , 52.620 , 54.950 ],
      [ 31.795 , 35.563 , 36.984 , 38.885 , 41.923 , 45.642 , 48.290 , 54.053 , 56.409 ],
      [ 32.912 , 36.741 , 38.184 , 40.113 , 43.195 , 46.963 , 49.645 , 55.477 , 57.860 ],
      [ 34.027 , 37.916 , 39.380 , 41.337 , 44.461 , 48.278 , 50.994 , 56.894 , 59.302 ],
      [ 35.139 , 39.087 , 40.573 , 42.557 , 45.722 , 49.588 , 52.336 , 58.302 , 60.738 ],
      [ 36.250 , 40.256 , 41.762 , 43.773 , 46.979 , 50.892 , 53.672 , 59.704 , 62.164 ],
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
    for ( var j = 0; j < pvaltable[0].length; j += 1) {
      if (pvaltable[ imax - 1][ j ] > x2) {
        pvalmin = pvaltable[ 0 ][ j ];
        break;
      } else {
        pvalmax = pvaltable[ 0 ][ j ];
      }
    }
    ft.pvalmax = pvalmax;
    ft.pvalmin = pvalmin;
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
