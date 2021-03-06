'use strict';

const { times } = lodash;
const { RichText } = wp.editor;
const { createBlock } = wp.blocks;
import { schema } from './_schema.js';

export const deprecated = [
	{
		attributes: schema,

		migrate( attributes ) {
			const migratedInnerBlocks = () => {
				let summary = attributes.summary;
				if ( summary.match( '</p></p>' ) ) {
					summary = attributes.summary.split( '</p><p>' );
				} else {
					summary = attributes.summary.split();
				}

				return times( summary.length, ( index ) => {
					const content = summary[ index ].replace( '<p>', '' ).replace( '</p>', '' );

					return createBlock( 'core/paragraph', {
						content: content,
					} );
				} );
			};

			return [
				attributes,
				migratedInnerBlocks(),
			];
		},

		save( { attributes } ) {
			const { title, summary, numberColor, imagePosition, imageID, imageURL, linkLabel, linkURL, linkTarget, linkColor } = attributes;

			return (
				<div className={ `smb-step__item smb-step__item--image-${ imagePosition }` }>
					<div className="smb-step__item__title">
						<div className="smb-step__item__number" style={ { backgroundColor: numberColor } }></div>
						<span>
							<RichText.Content value={ title } />
						</span>
					</div>

					{ !! imageID &&
						<div className="smb-step__item__figure">
							<img src={ imageURL } alt="" className={ `wp-image-${ imageID }` } />
						</div>
					}

					<div className="smb-step__item__body">
						<div className="smb-step__item__summary">
							<RichText.Content value={ summary } />
						</div>

						{ ! RichText.isEmpty( linkLabel ) &&
							<a
								className="smb-step__item__link"
								href={ linkURL }
								target={ linkTarget }
								style={ { color: linkColor } }
							>
								<i className="fas fa-arrow-circle-right" />
								<span className="smb-step__item__link__label">
									<RichText.Content value={ linkLabel } />
								</span>
							</a>
						}
					</div>
				</div>
			);
		},
	},
];
