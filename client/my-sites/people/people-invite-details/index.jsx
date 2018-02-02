/** @format */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import page from 'page';
import { get } from 'lodash';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import SidebarNavigation from 'my-sites/sidebar-navigation';
import HeaderCake from 'components/header-cake';
import Card from 'components/card';
import PeopleListItem from 'my-sites/people/people-list-item';
import Gravatar from 'components/gravatar';
import QuerySiteInvites from 'components/data/query-site-invites';
import Button from 'components/button';
import { getSelectedInvite } from 'state/invites/selectors';
import { deleteInvite } from 'state/invites/actions';

class PeopleInviteDetails extends React.PureComponent {
	static propTypes = {
		site: PropTypes.object.isRequired,
		inviteKey: PropTypes.string.isRequired,
	};

	goBack = () => {
		const siteSlug = get( this.props, 'site.slug' );
		const fallback = siteSlug ? '/people/invites/' + siteSlug : '/people/invites/';

		// Go back to last route with /people/invites as the fallback
		page.back( fallback );
	};

	handleDelete = () => {
		const { deleteInvite: _deleteInvite, invite, site } = this.props;
		_deleteInvite( site.ID, invite.key );
	};

	renderClearOrRevoke = () => {
		const { invite, translate } = this.props;
		const { isPending } = invite;
		const revokeMessage = translate(
			'Revoking an invite will no longer allow this person to join your site. ' +
				'You can always invite them again if your change your mind.'
		);
		const clearMessage = translate(
			'If you no longer wish to see this record, you can clear it. ' +
				'The person will still remain a member of this site.'
		);

		return (
			<div className="people-invite-details__clear-revoke">
				<div>{ isPending ? revokeMessage : clearMessage }</div>
				<Button primary={ isPending } scary={ isPending } onClick={ this.handleDelete }>
					{ isPending ? translate( 'Revoke Invite' ) : translate( 'Clear Invite' ) }
				</Button>
			</div>
		);
	};

	renderInvite = () => {
		const { site, invite } = this.props;

		return (
			<div>
				<Card>
					<PeopleListItem
						key={ invite.key }
						invite={ invite }
						user={ invite.user }
						site={ site }
						type="invite-details"
						isSelectable={ false }
					/>
					{ this.renderInviteDetails() }
				</Card>
				{ this.renderClearOrRevoke() }
			</div>
		);
	};

	renderInviteDetails = () => {
		const { invite, translate, moment } = this.props;
		const showName = invite.invitedBy.login !== invite.invitedBy.name;

		return (
			<div className="people-invite-details__meta">
				<div className="people-invite-details__meta-item">
					<span className="people-invite-details__meta-item-label">
						{ translate( 'Invited By' ) }
					</span>
					<Gravatar user={ invite.invitedBy } size={ 24 } />
					{ showName && (
						<span className="people-invite-details__meta-item-user">{ invite.invitedBy.name }</span>
					) }
					<span className="people-invite-details__meta-item-username">
						{ '@' + invite.invitedBy.login }
					</span>
				</div>
				<div className="people-invite-details__meta-item">
					<span className="people-invite-details__meta-item-label">{ translate( 'Sent' ) }</span>
					<span className="people-invite-details__meta-item-date">
						{ moment( invite.inviteDate ).format( 'LLL' ) }
					</span>
				</div>
				{ invite.acceptedDate && (
					<div className="people-invite-details__meta-item">
						<span className="people-invite-details__meta-item-label">
							{ translate( 'Accepted' ) }
						</span>
						<span className="people-invite-details__meta-item-date">
							{ moment( invite.acceptedDate ).format( 'LLL' ) }
						</span>
					</div>
				) }
			</div>
		);
	};

	render() {
		const { site, translate, invite } = this.props;

		if ( ! site || ! site.ID ) {
			return null;
		}

		return (
			<Main className="people-invite-details">
				<QuerySiteInvites siteId={ site.ID } />
				<SidebarNavigation />

				<HeaderCake isCompact onClick={ this.goBack }>
					{ translate( 'Invite' ) }
				</HeaderCake>

				{ invite && this.renderInvite() }
			</Main>
		);
	}
}

export default connect(
	( state, ownProps ) => {
		const siteId = ownProps.site && ownProps.site.ID;

		return {
			invite: getSelectedInvite( state, siteId, ownProps.inviteKey ),
		};
	},
	{ deleteInvite }
)( localize( PeopleInviteDetails ) );
