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
( function ( $ ) {
	$( document ).ready( function () {
		try {
			var pronunciationRecorder = new document.PronunciationRecorder();
			$( ".mw-voiceintro-message" ).text( 'message:voiceintro-mic-access-notify' );
			$( ".mw-voiceintro-record" ).on( "click", function () {
				$( ".mw-voiceintro-record" ).attr( 'disabled', 'disabled' );
				$( ".mw-voiceintro-stop" ).removeAttr( 'disabled' );
				$( ".mw-voiceintro-message" ).text( 'message:voiceintro-recording-notify' );
				pronunciationRecorder.startRecording();
			} );
			$( ".mw-voiceintro-stop" ).on( "click", function () {
				$( ".mw-voiceintro-message" ).empty();
				$( ".mw-voiceintro-stop" ).attr( 'disabled', 'disabled' );
				$( ".mw-voiceintro-clear" ).removeAttr( 'disabled' );
				pronunciationRecorder.stopRecording();
				pronunciationRecorder.createSource( function () {
				} );
			} );
			$( ".mw-voiceintro-clear" ).on( "click", function () {
				$( ".mw-voiceintro-record" ).removeAttr( 'disabled' );
				$( ".mw-voiceintro-preview-audio" ).remove();
				$( ".mw-voiceintro-upload" ).remove();
				$( ".mw-voiceintro-message" ).empty();
			} );
			$( document ).on( "click", ".mw-voiceintro-upload", function () {
				var pronunciationRecorderFileDetails, word, username, lang_code;
				word = $( ".mw-voiceintro-information-name" ).val();
				lang_code = $( ".mw-voiceintro-information-language" ).val();
				username = '{{subst:REVISIONUSER}}';
				pronunciationRecorderFileDetails = new document.PronunciationRecorderFileDetails( word, username, lang_code );
				$( ".mw-voiceintro-upload" ).attr( 'disabled', 'disabled' );
				pronunciationRecorder.startUploading( function () {
					console.log( 'Upload complete' );
					var name, $fileLink;
					name = 'File:' + pronunciationRecorderFileDetails.generateFileName();
					$fileLink = $( '<a>' );
					$fileLink.attr( "href", 'blahblah' ); //mw.util.wikiGetlink( name ) );
					$fileLink.text( name );
					var $message = $( ".mw-voiceintro-message" );
					$message.text( 'message:voiceintro-upload-publish-succeeded' );
					$message.append( " " + $fileLink );
				}, function () {
					$( ".mw-voiceintro-message" ).text( 'message:voiceintro-upload-publish-failed' );
				}, pronunciationRecorderFileDetails );
			} );
			$( ".mw-voiceintro-toolbar" ).show();
		}
		catch ( e ) {
			console.log( e );
			$( ".mw-voiceintro-message" ).text( 'message:voiceintro-webaudio-not-supported' );
		}
	} );
}( jQuery ) );
