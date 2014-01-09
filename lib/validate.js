var merge = require( "mout/object/merge" ),
	defaults = {
		component: true,
		limits: {
			subject: 72,
			other: 80
		}
	};

module.exports = function( message, options ) {
	options = merge( defaults, options );

	var errors = [];

	message.split(/\n/).forEach(function ( line, index ) {
		if ( index === 0 ) {
			if ( line.length > options.limits.subject ) {
				errors.push( "First line (subject) must be no longer than " +
					options.limits.subject + " characters" );
			}

			if ( options.component && line.indexOf( ":" ) < 1 ) {
				errors.push( "First line (subject) must indicate the component" );
			}

			if ( line.substring( line.indexOf( ":" ) + 1 ).length < 1 ) {
				errors.push( "First line (subject) must have a message after the component" );
			}
		}
		if ( index === 1 && line.length > 0 ) {
			errors.push( "Second line must always be empty" );
		}
		if ( index > 1 && line.length > options.limits.other ) {
			// skip comments
			if ( /^#/.test( line ) ) {
				return;
			}
			errors.push( "Commit message line " + ( index + 1 ) + " too long: " +
				line.length + " characters, only " + options.limits.other +
				" allowed. Was: " + line.substring( 0, 20 ) + "[...]" );
		}
	});

	return errors;
};