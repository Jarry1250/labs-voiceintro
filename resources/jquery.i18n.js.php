/**
 * VoiceIntro (c) 2014
 * For authors and information on reuse, see README
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with This program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */
<?php
	header( 'Content-type: application/javascript; charset=utf-8' );
	require_once( '/data/project/jarry-common/public_html/libs/i18n.php' );
	$I18N->loadTextdomain( 'voiceintro' );
	$messageKeys = $I18N->listMsgs( 'voiceintro' );
	$messages = array_flip( $messageKeys );
?>
( function ( $ ) {
	$.i18n = function ( label ){
		// An ultra-light alternative to a more powerful JS i18n suite,
		// let's just pull the messages in the current user language and make
		// them available in the JavaScript. Built to be replaced later if needed.
		var messages = {
<?php
	foreach( $messages as $label => &$content ) {
		// At the moment $content is a meaningless number, so fill it in
		$content = _html( $label, 'voiceintro', array( 'escape' => 'html' ) );

		// Now collapse the array for easy printing
		$content = "\t\t\t'$label': \"$content\"";
	}
	echo implode( ",\n", $messages ) . "\n";
?>
		};
		if( label in messages ){
			return messages[label];
		} else {
			return '[' + label + ']';
		}
	}
}( jQuery ) );