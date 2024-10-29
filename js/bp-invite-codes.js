jQuery( function( $ ) {

	// Listen for clicks to the join button
	$( document ).on( 'click', '.class_bp_invite_codes', function() {

        Swal.fire({
            title: 'Please enter the invite code',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
                placeholder:'e.g. H9eJl32'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: (invite_code) => {

                // Setup our variables
                var $this = $(this), gid = $this.parent().prop('id');

                gid = gid.split('-')[1];

                var button_action = $this.data('bp-btn-action');

                return new Promise(function(resolve) {

                    if(!invite_code) {
                        Swal.showValidationMessage('Please enter invite code');
                        resolve();
                        return;
                    }

                    var button_target = $("div#groupbutton-" + gid).parent('.groups-meta.action');

                    // Run our ajax request
                    $.ajax( {
                        url : bp_invite_codes.ajaxurl,
                        data : {
                            'action' : 'bos_invite_codes_validate',
                            'entered_code' : invite_code,
                            'group_id' : gid,
                            'button_action' : button_action
                        },
                        dataType : 'json',
                        beforeSend: function() {
                            $this.addClass('pending loading');
                        },
                        complete: function() {
                            $this.removeClass('pending loading');
                        },
                        success : function( response ) {

                            if(response.success) {

                                Swal.fire({
                                    type: 'success',
                                    title: 'Invite code applied successfully.',
                                    showConfirmButton: false,
                                    timer: 3500
                                });

                                if(response.data.is_group == false) {
                                    button_target.html(response.data.contents);
                                } else {
                                    location.reload();
                                }

                            } else {
                                Swal.showValidationMessage(response.data);
                                resolve();
                            }
                        },
                        error : function() {

                            Swal.fire({
                                type: 'error',
                                title: 'An error occurred while processing your request, please try again later.',
                            });
                        }
                    });
                });
            },

            allowOutsideClick: false

        });

	});

});