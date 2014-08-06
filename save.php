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

	if( !isset( $_FILES["audio-blob"] ) ) die( "An error occurred." );
	if( !isset( $_POST["audio-filename"] ) ) die( "An error occurred." );
	if( !isset( $_POST["audio-description"] ) ) die( "An error occurred." );

	$fileName = $_POST["audio-filename"];
	$fileDescription = $_POST['audio-description'];
	$oggName = substr( $_POST["audio-filename"], 0, -3 ) . 'ogg';
	$uploadPath = '/data/project/voiceintro/public_html/uploads/' . $fileName;

	if( !move_uploaded_file( $_FILES["audio-blob"]["tmp_name"], $uploadPath ) ){
		die( "An error occurred. Problem moving uploaded file from {$_FILES["audio-blob"]["tmp_name"]} to $uploadPath" );
	}

	// Transcode to .ogg
	$oggPath = substr( $uploadPath, 0, -3 ) . 'ogg';
	exec( 'rm "' . $oggPath . '"' );
	exec( '/usr/bin/avconv -i "' . $uploadPath . '" -c:a libvorbis -qscale 100 "' . $oggPath . '"' );

	// Send email
	$url = "File:\nhttp://tools.wmflabs.org/voiceintro/uploads/" . $oggName;
	$description = "$url\n\nSuggested description:\n$fileDescription";
	mail( 'harryaburt@gmail.com', 'New VoiceIntro submission', $description );


//

