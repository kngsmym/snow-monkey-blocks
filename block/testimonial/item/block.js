'use strict';

import classnames from 'classnames';

const { registerBlockType } = wp.blocks;
const { RichText, MediaUpload } = wp.editor;
const { Button } = wp.components;
const { __ } = wp.i18n;

registerBlockType( 'snow-monkey-blocks/testimonial--item', {
	title: __( 'Item', 'snow-monkey-blocks' ),
	icon: 'admin-comments',
	category: 'smb',
	parent: [ 'snow-monkey-blocks/testimonial' ],
	attributes: {
		avatarID: {
			type: 'number',
			default: 0,
		},
		avatarURL: {
			type: 'string',
			source: 'attribute',
			selector: '.smb-testimonial__item__figure > img',
			attribute: 'src',
			default: 'https://0.gravatar.com/avatar/00000000000000000000000000000000?s=128&d=mp&r=g',
		},
		name: {
			source: 'html',
			selector: '.smb-testimonial__item__name',
		},
		lede: {
			source: 'html',
			selector: '.smb-testimonial__item__lede',
		},
		content: {
			source: 'html',
			selector: '.smb-testimonial__item__content',
		},
	},

	edit( { attributes, setAttributes, isSelected, className } ) {
		const { avatarID, avatarURL, name, lede, content } = attributes;

		const renderAvatar = ( obj ) => {
			return (
				<Button className="image-button" onClick={ obj.open } style={ { padding: 0 } }>
					<img src={ avatarURL } alt="" className={ `wp-image-${ avatarID }` } />
				</Button>
			);
		};

		return (
			<div className={ classnames( 'c-row__col', className ) }>
				<div className="smb-testimonial__item">
					{ ( !! avatarID || isSelected ) &&
						<div className="smb-testimonial__item__figure">
							<MediaUpload
								onSelect={ ( media ) => {
									const newAvatarURL = !! media.sizes.thumbnail ? media.sizes.thumbnail.url : media.url;
									setAttributes( { avatarURL: newAvatarURL } );
									setAttributes( { avatarID: media.id } );
								} }
								type="image"
								value={ avatarID }
								render={ renderAvatar }
							/>
						</div>
					}

					<div className="smb-testimonial__item__body">
						<div className="smb-testimonial__item__content">
							<RichText
								placeholder={ __( 'Write content...', 'snow-monkey-blocks' ) }
								value={ content }
								onChange={ ( value ) => setAttributes( { content: value } ) }
							/>
						</div>

						<RichText
							className="smb-testimonial__item__name"
							placeholder={ __( 'Write name...', 'snow-monkey-blocks' ) }
							value={ name }
							onChange={ ( value ) => setAttributes( { name: value } ) }
						/>

						{ ( ! RichText.isEmpty( lede ) || isSelected ) &&
							<RichText
								className="smb-testimonial__item__lede"
								placeholder={ __( 'Write lede...', 'snow-monkey-blocks' ) }
								value={ lede }
								onChange={ ( value ) => setAttributes( { lede: value } ) }
							/>
						}
					</div>
				</div>
			</div>
		);
	},

	save( { attributes } ) {
		const { avatarID, avatarURL, name, lede, content } = attributes;

		return (
			<div className="c-row__col">
				<div className="smb-testimonial__item">
					<div className="smb-testimonial__item__figure">
						<img src={ avatarURL } alt="" className={ `wp-image-${ avatarID }` } />
					</div>
					<div className="smb-testimonial__item__body">
						<div className="smb-testimonial__item__content">
							<RichText.Content value={ content } />
						</div>

						<div className="smb-testimonial__item__name">
							<RichText.Content value={ name } />
						</div>

						{ ! RichText.isEmpty( lede ) &&
							<div className="smb-testimonial__item__lede">
								<RichText.Content value={ lede } />
							</div>
						}
					</div>
				</div>
			</div>
		);
	},
} );
