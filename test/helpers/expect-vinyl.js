/**
 * Assertion helpers for vinyl Object
 * @file
 */

import 'should'
import path from 'path'

/**
 * create a callback to check if the given Vinyl has a certain filename
 * @param  {string}   name name or regex pattern
 * @return {Function} exec assertion
 */
export const hasName = name => file => name.should.equal(path.basename(file.path))

/**
 * create a callback to check if the given Vinyl has a certain filename
 * @param  {string}   ext name or regex pattern
 * @return {Function} exec assertion
 */
export const hasExtname = ext => file => ext.should.equal(path.extname(file.path))
