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

// ## stats

// Load accessor.
// var value = require( './accessor.js' );
// Load wink helpers for validation.
//  var helpers = require( 'wink-helpers' );

// ### P-Value
/**
 *
 * @name stats.pvalue
 * @param {number} x2 — chi-squared statistic
 * @param {number} df — degrees of freedom;
 * @param {number} sl — significance level (should be between 0 and 1);

 * @returns {object} `pval` containing 'dfused','slused'
 * @example
 */
var pvalue = function ( x2, df, sl ) {
  if ( ( typeof x2 !== 'number' ) ) {
    throw Error( 'stats-pvalue: x2 should be a number, instead found: ' + JSON.stringify( x2 ) );
  }
  if ( ( typeof df !== 'number' ) || ( df <= 0 ) || df % 1 !== 0 ) {
    throw Error( 'stats-pvalue: df should be a natural number greater than 0, instead found: ' + JSON.stringify( df ) );
  }
  if ( ( typeof sl !== 'number' ) || ( sl <= 0 ) || ( sl >= 1 ) ) {
    throw Error( 'stats-pvalue: sl should be a number between 0 & 1, instead found: ' + JSON.stringify( sl ) );
  }
  var pval = Object.create(null);
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
  if (df > 30) {
    pval.dfused = 30;
  } else {
    pval.dfused = df;
  }
  if ( df > 30 ) {
    throw String( 'Table does not contain df value greater than 30 so df will default to 30' );
  }
  for ( var i = 0; i < pvaltable[0].length; i += 1) {
    if ( ( 1 - sl ) >= pvaltable[ 0 ][ i ] ) {
      pval.slused = 1 - pvaltable[ 0 ][ i ];
      if ( ( 1 - sl ) !== pvaltable[ 0 ][ i ] ) {
        throw String( 'Table does not contain significance level of ', ( 1 - sl ) * 100 , '% so nearest significance level of ', pval.slused * 100 , '% will be used.');
      }
      if ( x2 >= pvaltable[ pval.dfused ][ i ]) {
        pval.significance = ('The data is significant for ', pval.slused * 100 ,'% at ', pval.dfused ,' degrees of freedom');
      } else {
        pval.significance = ('The data is insignificant for ', pval.slused * 100 ,'% at ', pval.dfused ,' degrees of freedom and will be significant at chi-squared statistic (x2) of ', pvaltable[ pval.dfused ][ i ] );
      }
    }
  }
  return pval;
}; // pvalue()

module.exports = pvalue;
