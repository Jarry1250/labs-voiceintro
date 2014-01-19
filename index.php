<?php
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

	require_once( '/data/project/jarry-common/public_html/global.php' );
	require_once( '/data/project/jarry-common/public_html/OAuthHandler.php' );
	require_once( '/data/project/voiceintro/OAuthConfig.php' );

	echo get_html( 'header', 'VoiceIntro' );

	// Details from OAuthConfig.php
	$oAuth = new OAuthHandler( $details );

	// Fetch the access token if this is the callback from requesting authorization
	if ( isset( $_GET['oauth_verifier'] ) && $_GET['oauth_verifier'] ) {
		$oAuth->fetchAccessToken();
		header( 'Location: ' . $_SERVER['PHP_SELF'] );
	}

	// $username is fakeable using a MITM under OAuth Connect goes live
	$username = $oAuth->authorizeMe();

	echo "Hello $username.";

	echo '<div class="mw-voiceintro-message" ></div>';
	echo '<div class="mw-voiceintro-toolbar" >';
	echo '<button class="mw-voiceintro-record" disabled >' . _html( 'voiceintro-toolbar-record-label', 'voiceintro' ).'</button>';
	echo '<button class="mw-voiceintro-stop" disabled >' . _html( 'voiceintro-toolbar-stop-label', 'voiceintro' ).'</button>';
	echo '<button class="mw-voiceintro-clear" disabled >' . _html( 'voiceintro-toolbar-clear-label', 'voiceintro' ).'</button>';
	echo '<div class="mw-voiceintro-preview-div" ></div>';
	echo '</div>';
	echo '<form>';
	echo '<fieldset>';
	echo '<legend>'. _html( 'voiceintro-information-label', 'voiceintro' ).'</legend>';
	echo '<b>'. _html( 'voiceintro-information-speaker-label', 'voiceintro' ).'</b><input type="text" class="mw-voiceintro-information-speaker"><br><br>';
	$languages = array( 'en' => 'English' ); //Language::getLanguageNames();
	echo '<b>'. _html( 'voiceintro-information-language-label', 'voiceintro' ).'</b><select class="mw-voiceintro-information-language">';
	foreach( $languages as $lang_code => $lang_name) {
		echo '<option value="' . $lang_code . '">' . $lang_code.' - '.$lang_name  . '</option>';
	}
	echo '</select>';
	echo '<br><br>';//.  _html( 'voiceintro-information-license-prompt:$user', 'voiceintro' );
	echo '<div class="mw-voiceintro-information-license-cc-by-sa" >'.
	 'message:mwe-upwiz-source-ownwork-assert-cc-by-sa-3.0:1:$user:http://creativecommons.org/licenses/by-sa/3.0/deed.en' . '<br>';
	echo  _html( 'mwe-upwiz-source-ownwork-cc-by-sa-3.0-explain:1', 'voiceintro' ) . '<br></div>';
	echo '</fieldset>';
	echo '</form>';

	echo '<script type="text/javascript" src="resources/jquery.fileDetails.js"></script>';
	echo '<script type="text/javascript" src="resources/jquery.pronunciationRecorder.js"></script>';
	echo '<script type="text/javascript" src="resources/jquery.general.js"></script>';
	echo '<script type="text/javascript" src="resources/recorder.js"></script>';
	echo get_html( 'footer' );
