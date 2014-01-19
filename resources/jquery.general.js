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
			var audioRecorder = new document.audioRecorder();
			$( ".mw-voiceintro-message" ).text( $.i18n( 'voiceintro-mic-access-notify' ) );
			$( ".mw-voiceintro-record" ).on( "click", function () {
				$( ".mw-voiceintro-record" ).attr( 'disabled', 'disabled' );
				$( ".mw-voiceintro-stop" ).removeAttr( 'disabled' );
				$( ".mw-voiceintro-message" ).text( $.i18n( 'voiceintro-recording-notify' ) );
				audioRecorder.startRecording();
			} );
			$( ".mw-voiceintro-stop" ).on( "click", function () {
				$( ".mw-voiceintro-message" ).empty();
				$( ".mw-voiceintro-stop" ).attr( 'disabled', 'disabled' );
				$( ".mw-voiceintro-clear" ).removeAttr( 'disabled' );
				audioRecorder.stopRecording();
				audioRecorder.createSource( function () {
				} );
			} );
			$( ".mw-voiceintro-clear" ).on( "click", function () {
				$( ".mw-voiceintro-record" ).removeAttr( 'disabled' );
				$( ".mw-voiceintro-preview-audio" ).remove();
				$( ".mw-voiceintro-upload" ).remove();
				$( ".mw-voiceintro-message" ).empty();
			} );
			$( document ).on( "click", ".mw-voiceintro-upload", function () {
				var audioRecorderFileDetails, speaker, username, lang_code;
				speaker = $( ".mw-voiceintro-information-speaker" ).val();
				lang_code = $( ".mw-voiceintro-information-language" ).val();
				username = '{{subst:REVISIONUSER}}';
				audioRecorderFileDetails = new document.audioRecorderFileDetails( speaker, username, lang_code );
				$( ".mw-voiceintro-upload" ).attr( 'disabled', 'disabled' );
				audioRecorder.startUploading( function () {
					console.log( 'Upload complete' );
					var name, $fileLink;
					name = 'File:' + audioRecorderFileDetails.generateFileName();
					$fileLink = $( '<a>' );
					$fileLink.attr( "href", 'http://test.wikipedia.org/wiki/' + name );
					$fileLink.text( name );
					var $message = $( ".mw-voiceintro-message" );
					$message.text( $.i18n( 'voiceintro-upload-publish-succeeded' ) );
					$message.append( " " + $fileLink );
				}, function () {
					$( ".mw-voiceintro-message" ).text( $.i18n( 'voiceintro-upload-publish-failed' ) );
				}, audioRecorderFileDetails );
			} );
			$( ".mw-voiceintro-toolbar" ).show();
		}
		catch ( e ) {
			console.log( e );
			$( ".mw-voiceintro-message" ).text( $.i18n( 'voiceintro-webaudio-not-supported' ) );
		}
	} );
}( jQuery ) );
