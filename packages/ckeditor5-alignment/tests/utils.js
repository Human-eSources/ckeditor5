/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { CKEditorError } from '../../../src/utils';
import { isDefault, isSupported, supportedOptions, normalizeAlignmentOptions } from '../src/utils';

describe( 'utils', () => {
	describe( 'isDefault()', () => {
		it( 'should return true for "left" alignment only (LTR)', () => {
			const locale = {
				contentLanguageDirection: 'ltr'
			};

			expect( isDefault( 'left', locale ) ).to.be.true;
			expect( isDefault( 'right', locale ) ).to.be.false;
			expect( isDefault( 'center', locale ) ).to.be.false;
			expect( isDefault( 'justify', locale ) ).to.be.false;
		} );

		it( 'should return true for "right" alignment only (RTL)', () => {
			const locale = {
				contentLanguageDirection: 'rtl'
			};

			expect( isDefault( 'left', locale ) ).to.be.false;
			expect( isDefault( 'right', locale ) ).to.be.true;
			expect( isDefault( 'center', locale ) ).to.be.false;
			expect( isDefault( 'justify', locale ) ).to.be.false;
		} );
	} );

	describe( 'isSupported()', () => {
		it( 'should return true for supported alignments', () => {
			expect( isSupported( 'left' ) ).to.be.true;
			expect( isSupported( 'right' ) ).to.be.true;
			expect( isSupported( 'center' ) ).to.be.true;
			expect( isSupported( 'justify' ) ).to.be.true;

			expect( isSupported( '' ) ).to.be.false;
			expect( isSupported( 'middle' ) ).to.be.false;
		} );
	} );

	describe( 'supportedOptions', () => {
		it( 'should be set', () => {
			expect( supportedOptions ).to.deep.equal( [ 'left', 'right', 'center', 'justify' ] );
		} );
	} );

	describe( 'normalizeAlignmentOptions', () => {
		it( 'does nothing when no parameters are provided', () => {
			let result;

			expect( () => {
				result = normalizeAlignmentOptions();
			} ).not.to.throw();

			expect( result ).to.deep.equal( [ ] );
		} );

		it( 'normalizes mixed input into an config array of objects', () => {
			const config = [
				'left',
				{
					name: 'right'
				},
				'center',
				{
					name: 'justify',
					className: 'foo-center'
				}
			];

			const result = normalizeAlignmentOptions( config );

			expect( result ).to.deep.equal(
				[
					{
						'name': 'left'
					},
					{
						'name': 'right'
					},
					{
						'name': 'center'
					},
					{
						'className': 'foo-center',
						'name': 'justify'
					}
				]
			);
		} );

		it( 'throws when the name already exists', () => {
			const config = [
				'center',
				{
					name: 'center'
				}
			];
			let error;

			try {
				normalizeAlignmentOptions( config );
			} catch ( err ) {
				error = err;
			}

			expect( error.constructor ).to.equal( CKEditorError );
			expect( error ).to.match( /alignment-config-name-already-defined/ );
		} );

		it( 'throws when the className already exists', () => {
			const config = [
				'left',
				{
					name: 'center',
					className: 'foo-center'
				},
				{
					name: 'justify',
					className: 'foo-center'
				}
			];
			let error;

			try {
				normalizeAlignmentOptions( config );
			} catch ( err ) {
				error = err;
			}

			expect( error.constructor ).to.equal( CKEditorError );
			expect( error ).to.match( /alignment-config-classname-already-defined/ );
		} );
	} );
} );
