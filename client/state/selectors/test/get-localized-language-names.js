/** @format */

/**
 * Internal dependencies
 */
import { getLocalizedLanguageNames } from 'state/selectors';

describe( 'getLocalizedLanguageNames()', () => {
	test( 'should return', () => {
		const localizedLanguageNames = getLocalizedLanguageNames( {
			i18n: {
				languageNames: {},
			},
		} );

		expect( localizedLanguageNames ).toBe( null );
	} );

	test( 'should return the language names', () => {
		const localizedLanguageNames = getLocalizedLanguageNames( {
			i18n: {
				languageNames: {
					items: {
						it: {
							localized: 'Italienisch',
							name: 'Italiano',
							en: 'Italian',
						},
					},
				},
			},
		} );

		expect( localizedLanguageNames ).toEqual( {
			it: {
				localized: 'Italienisch',
				name: 'Italiano',
				en: 'Italian',
			},
		} );
	} );
} );
