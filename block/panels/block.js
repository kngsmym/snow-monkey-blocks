'use strict';

import classnames from 'classnames';
import toNumber from '../../src/js/helper/to-number';
import { deprecated } from './_deprecated.js';

const { registerBlockType } = wp.blocks;
const { InspectorControls, InnerBlocks } = wp.editor;
const { PanelBody, RangeControl, ToggleControl, TabPanel, Dashicon } = wp.components;
const { Fragment } = wp.element;
const { __ } = wp.i18n;

registerBlockType( 'snow-monkey-blocks/panels', {
	title: __( 'Panels', 'snow-monkey-blocks' ),
	icon: 'screenoptions',
	category: 'smb',
	attributes: {
		sm: {
			type: 'number',
			default: 1,
		},
		md: {
			type: 'number',
			default: 1,
		},
		lg: {
			type: 'number',
			default: 2,
		},
		imagePadding: {
			type: 'boolean',
			default: false,
		},
		itemTitleTagName: { // backward compatibility
			type: 'string',
			default: 'div',
		},
	},

	edit( { attributes, setAttributes, className } ) {
		const { sm, md, lg, imagePadding } = attributes;

		const allowedBlocks = [ 'snow-monkey-blocks/panels--item' ];
		const template = [ [ 'snow-monkey-blocks/panels--item' ] ];

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Panels Settings', 'snow-monkey-blocks' ) }>
						<TabPanel
							className="smb-inspector-tabs"
							tabs={ [
								{
									name: 'desktop',
									title: <Dashicon icon="desktop" />,
								},
								{
									name: 'tablet',
									title: <Dashicon icon="tablet" />,
								},
								{
									name: 'mobile',
									title: <Dashicon icon="smartphone" />,
								},
							] }>
							{
								( tab ) => {
									if ( tab.name ) {
										if ( 'desktop' === tab.name ) {
											return (
												<RangeControl
													label={ __( 'Columns per row (Large window)', 'snow-monkey-blocks' ) }
													value={ lg }
													onChange={ ( value ) => setAttributes( { lg: toNumber( value, 1, 4 ) } ) }
													min="1"
													max="4"
												/>
											);
										}

										if ( 'tablet' === tab.name ) {
											return (
												<RangeControl
													label={ __( 'Columns per row (Medium window)', 'snow-monkey-blocks' ) }
													value={ md }
													onChange={ ( value ) => setAttributes( { md: toNumber( value, 1, 4 ) } ) }
													min="1"
													max="4"
												/>
											);
										}

										if ( 'mobile' === tab.name ) {
											return (
												<RangeControl
													label={ __( 'Columns per row (Small window)', 'snow-monkey-blocks' ) }
													value={ sm }
													onChange={ ( value ) => setAttributes( { sm: toNumber( value, 1, 4 ) } ) }
													min="1"
													max="4"
												/>
											);
										}
									}
								}
							}
						</TabPanel>

						<ToggleControl
							label={ __( 'Set padding around images', 'snow-monkey-blocks' ) }
							checked={ imagePadding }
							onChange={ ( value ) => setAttributes( { imagePadding: value } ) }
						/>
					</PanelBody>
				</InspectorControls>

				<div className={ classnames( 'smb-panels', className ) } data-image-padding={ imagePadding }>
					<div className="c-row c-row--margin c-row--fill" data-columns={ sm } data-md-columns={ md } data-lg-columns={ lg }>
						<InnerBlocks
							allowedBlocks={ allowedBlocks }
							template={ template }
							templateLock={ false }
						/>
					</div>
				</div>
			</Fragment>
		);
	},

	save( { attributes } ) {
		const { sm, md, lg, imagePadding } = attributes;

		return (
			<div className="smb-panels" data-image-padding={ imagePadding }>
				<div className="c-row c-row--margin c-row--fill" data-columns={ sm } data-md-columns={ md } data-lg-columns={ lg }>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},

	deprecated: deprecated,
} );
