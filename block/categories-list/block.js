'use strict';

import toNumber from '../../src/js/helper/to-number';

const { remove, union, indexOf, compact } = lodash;
const { apiFetch } = wp;
const { registerStore, withSelect } = wp.data;
const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.editor;
const { PanelBody, RangeControl, Spinner, CheckboxControl } = wp.components;
const { Fragment } = wp.element;
const { __ } = wp.i18n;

const actions = {
	setArticleCategories( articleCategories ) {
		return {
			type: 'SET_ARTICLE_CATEGORIES',
			articleCategories,
		};
	},
	receiveArticleCategories( path ) {
		return {
			type: 'RECEIVE_ARTICLE_CATEGORIES',
			path,
		};
	},
};

registerStore( 'snow-monkey-blocks/categories-list', {
	reducer( state = { articleCategories: {} }, action ) {
		switch ( action.type ) {
			case 'SET_ARTICLE_CATEGORIES':
				return {
					...state,
					articleCategories: action.articleCategories,
				};
			case 'RECEIVE_ARTICLE_CATEGORIES':
				return action.articleCategories;
		}
		return state;
	},
	actions,
	selectors: {
		receiveArticleCategories( state ) {
			const { articleCategories } = state;
			return articleCategories;
		},
	},
	controls: {
		RECEIVE_ARTICLE_CATEGORIES( action ) {
			return apiFetch( { path: action.path } );
		},
	},
	resolvers: {
		* receiveArticleCategories() {
			const articleCategories = yield actions.receiveArticleCategories( '/wp/v2/categories/?per_page=100' );
			return actions.setArticleCategories( articleCategories );
		},
	},
} );

registerBlockType( 'snow-monkey-blocks/categories-list', {
	title: __( 'Categories list', 'snow-monkey-blocks' ),
	description: __( 'This is a block that displays a list of categories', 'snow-monkey-blocks' ),
	icon: 'excerpt-view',
	category: 'smb',

	edit: withSelect( ( select ) => {
		return {
			articleCategories: select( 'snow-monkey-blocks/categories-list' ).receiveArticleCategories(),
		};
	} )( ( props ) => {
		const { attributes: { articles, exclusionCategories }, articleCategories, className, setAttributes } = props;
		if ( ! articleCategories.length ) {
			return (
				<p className={ className }>
					<Spinner />
					{ __( 'Loading Setting Data', 'snow-monkey-blocks' ) }
				</p>
			);
		}

		const _generateNewExclusionCategories = ( isChecked, categoryId ) => {
			let newExclusionCategories = [];
			if ( exclusionCategories !== undefined && exclusionCategories !== null ) {
				newExclusionCategories = exclusionCategories.split( ',' );
			}
			if ( isChecked ) {
				newExclusionCategories.push( categoryId );
			} else {
				newExclusionCategories = remove( newExclusionCategories, ( value ) => categoryId !== value );
			}
			return compact( union( newExclusionCategories ) ).join( ',' );
		};

		const viewCategoriesPanel = () => {
			const articleCategoriesList = [];
			articleCategories.map( ( category ) => {
				articleCategoriesList.push(
					<CheckboxControl
						label={ category.name }
						value={ String( category.id ) }
						checked={ -1 !== indexOf( exclusionCategories.split( ',' ), String( category.id ) ) }
						onChange={ ( isChecked ) => {
							setAttributes( { exclusionCategories: _generateNewExclusionCategories( isChecked, String( category.id ) ) } );
						} }
					/>
				);
			} );
			return (
				<PanelBody title={ __( 'Exclusion Categories Settings', 'snow-monkey-blocks' ) }>
					<p>{ __( 'Categories with a post count of 0 are not displayed even if they are not excluded', 'snow-monkey-blocks' ) }</p>
					{ articleCategoriesList }
				</PanelBody>
			);
		};

		const viewCategoriesList = () => {
			const articleCategoriesList = [];
			articleCategories.map( ( category ) => {
				if ( category.count > 0 && ( -1 === indexOf( exclusionCategories.split( ',' ), String( category.id ) ) ) ) {
					articleCategoriesList.push(
						<li className="smb-categories-list__item">
							<div className="smb-categories-list__item__count">
								{ category.count }
								<span>{ __( 'articles', 'snow-monkey-blocks' ) }</span>
							</div>
							<div className="smb-categories-list__item__detail">
								<div className="smb-categories-list__item__category-name">
									{ category.name }
								</div>
								{ category.description &&
									<div className="smb-categories-list__item__category-description">
										{ category.description }
									</div>
								}
								<div className="smb-categories-list__item__recent-label">
									{ __( 'Recent posts', 'snow-monkey-blocks' ) }
								</div>
								<ul className="smb-categories-list__item__list">
									<li>{ __( 'Only the actual contribution screen is displayed', 'snow-monkey-blocks' ) }</li>
								</ul>
							</div>
						</li>
					);
				}
			} );
			return (
				<div className="smb-categories-list">
					<ul className="smb-categories-list__list">
						{ articleCategoriesList }
					</ul>
				</div>
			);
		};

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Categories list Settings', 'snow-monkey-blocks' ) }>
						<RangeControl
							label={ __( 'Categories List Articles', 'snow-monkey-blocks' ) }
							value={ articles }
							onChange={ ( value ) => setAttributes( { articles: toNumber( value, 1, 5 ) } ) }
							min="1"
							max="5"
						/>
					</PanelBody>
					{ viewCategoriesPanel() }
				</InspectorControls>
				{ viewCategoriesList() }
			</Fragment>
		);
	} ),

	save() {
		return null;
	},
} );
