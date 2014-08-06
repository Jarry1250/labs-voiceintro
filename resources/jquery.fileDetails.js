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
	document.AudioRecorderFileDetails = function ( speaker, article, lang_code ) {
		var description, date_obj, fulldate, source, author, permission, category, lang_subst = "{{subst:#language:" + lang_code + "|en}}";
		date_obj = new Date();

		if( article != '' ) speaker = '[[' + article + '|' + speaker + ']]';
		description = "{{en|Audio snippet of " + speaker + " in " + lang_subst + '.}}';

		function pad( param ) {
			if ( param < 10 ) {
				return '0' + param;
			} else {
				return param;
			}
		}

		fulldate = date_obj.getFullYear() + "-" + pad( date_obj.getMonth() + 1 ) + "-" + pad( date_obj.getDate() );
		source = '{{Created with VoiceIntro}}';
		author = speaker;
		permission = '{{Cc-by-sa-3.0}}{{PermissionOTRS|id=number or ticket=URL}}';

		return {
			generateWikiText: function () {
				return '{{Information\n |description = ' + description + '\n |date = ' + fulldate + '\n |source = ' + source + '\n |author = ' + author + '\n |permission = ' + permission + '\n}}';
			},

			generateFileName: function () {
				var name = speaker + ' (' + lang_code + ' VoiceIntro).wav';
				name = name.replace( / /g, '_' );
				return name;
			}
		}
	}
}( jQuery ) );