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

	// Ensure we are authorised by this point
	require_once( '/data/project/jarry-common/public_html/OAuthHandler.php' );
	require_once( '/data/project/voiceintro/OAuthConfig.php' );
	global $details; // $details from OAuthConfig.php
	$oAuth = new OAuthHandler( $details );
	$username = $oAuth->authorizeMe();

	if( !isset( $_FILES["audio-blob"] ) ) die( "An error occurred." );
	if( !isset( $_POST["audio-filename"] ) ) die( "An error occurred." );
	if( !isset( $_POST["audio-description"] ) ) die( "An error occurred." );

	$fileName = $_POST["audio-filename"];
	$fileDescription = $_POST['audio-description'];
	$oggName = substr( $_POST["audio-filename"], 0, -3 ) . 'ogg';
	$uploadDirectory = '/data/project/voiceintro/public_html/uploads/' . $fileName;

	if( !move_uploaded_file( $_FILES["audio-blob"]["tmp_name"], $uploadDirectory ) ){
		die( "An error occurred. Problem moving uploaded file from {$_FILES["audio-blob"]["tmp_name"]} to $uploadDirectory" );
	}

	// Transcode to .ogg
	$oggDirectory = substr( $uploadDirectory, 0, -3 ) . 'ogg';
	exec( 'rm "' . $oggDirectory . '"' );
	exec( '/usr/bin/avconv -i "' . $uploadDirectory . '" -c:a libvorbis -qscale 100 "' . $oggDirectory . '"' );

	// And do upload
	$res = $oAuth->doApiQuery( array(
		'action' => 'tokens',
		'type' => 'edit',
	), $ch );

	if ( !isset( $res->tokens->edittoken ) ) die( "An error occurred." );
	$token = $res->tokens->edittoken;
	$oAuth->doApiQuery( array(
		'action' => 'upload',
		'filename' => $oggName,
		'token' => $token,
		'file' => "@/$oggDirectory;type=audio/ogg",
		'comment' => 'Upload audio snipped using VoiceIntro tool',
		'text' => $fileDescription,
		'ignorewarnings' => 1
	), array(
		//'Content-Disposition: form-data; filename=' . $oggName
	) );