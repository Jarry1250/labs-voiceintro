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
	document.PronunciationRecorder = function () {

		var audioContext, recorder, cachedBlob;

		function startUserMedia( stream ) {
			$( ".mw-voiceintro-record" ).removeAttr( 'disabled' );
			$( ".mw-voiceintro-message" ).empty();
			var input = audioContext.createMediaStreamSource( stream );
			console.log( 'Media Stream created' );
			recorder = new Recorder( input );
			console.log( 'Audio Recorder initialized' );
		}

		function getBlob( callback ) {
			if ( cachedBlob ) {
				callback( cachedBlob );
			}
			else {
				recorder.exportWAV(
					function ( blob ) {
						cachedBlob = blob;
						callback( cachedBlob );
					}
				);
			}
		}

		function errorCallBack( e ) {
			if ( console ) console.log( 'No live audio input' );
		}

		try {
			// webkit shim
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
			window.URL = window.URL || window.webkitURL;
			if ( window.AudioContext ) {
				console.log( 'Audio Context set up' );
			} else {
				console.log( 'WebAudio API is not supported for this browser' );
			}
			audioContext = new AudioContext;
			if ( navigator.getUserMedia ) {
				console.log( 'getUserMedia is supported' );
			} else {
				console.log( 'getUserMedia is not supported' );
			}
		} catch ( e ) {
			console.log( 'WebAudio API is not supported for this browser' );
			throw e;
		}
		navigator.getUserMedia( {audio: true}, startUserMedia, errorCallBack );

		return {
			startRecording: function () {
				cachedBlob = null;
				recorder.clear();
				recorder.record();
			},

			stopRecording: function () {
				recorder.stop();
			},

			createSource: function ( callback ) {
				if ( recorder ) {
					getBlob(
						// this is the asynchronous callback that's called when exportWAV finishes encoding
						function ( blob ) {
							var message = $( '<br><audio controls class="mw-voiceintro-preview-audio"><source src="' + URL.createObjectURL( blob ) + '" type="audio/wav"></audio>' );
							var upload = $( '<br><button class="mw-voiceintro-upload">' + $.i18n('voiceintro-toolbar-upload-label') + '</button>' );
							$( ".mw-voiceintro-preview-div" ).empty();
							upload.prependTo( ".mw-voiceintro-preview-div" );
							message.prependTo( ".mw-voiceintro-preview-div" );
						}
					);
				}
			},

			startUploading: function ( ok, error, fileDetails ) {
				var filesDiv;
				filesDiv = document.createElement( "div" );

				console.log( "Handing off to PHP for save and upload..." );
				var fileName = fileDetails.generateFileName();
				var fileDescription = fileDetails.generateWikiText();

				getBlob(
					function ( blob ) {
						var formData = new FormData();
						formData.append( 'audio-filename', fileName );
						formData.append( 'audio-description', fileDescription );
						formData.append( 'audio-blob', blob );
						$.ajax({
							url: 'http://tools.wmflabs.org/voiceintro/save.php',
							data: formData,
							processData: false,
							contentType: false,
							type: 'POST',
							success: ok,
							error: error
						});
					}
				);
			}
		};
	};
}( jQuery ) );