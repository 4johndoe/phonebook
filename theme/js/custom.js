var Module = {};

Module.Phonebook = (function() {
	var content_id = "#homepage-content",
		page_title_id = "#page-title-id",
		main_modal = '#phonebook-main-modal-id',
		controller = 'Home',
		close_btn_modal = '#btn-close-modal-id';

	var modal = (function() {

		function show_modal() {
			
			$(main_modal).modal('show');
		}

		function hide_modal() {
			$(main_modal).modal('hide');
			$(main_modal).html('');
		}

		function close_modal_trigger(){

			$(close_btn_modal).click(function(){
				hide_modal();
			});
			return false;
		}

		return {
			show_modal: show_modal,
			hide_modal: hide_modal,
			close_modal_trigger: close_modal_trigger
		}

	})();

	function init() {

		$.ajax({
			url: 'Home/ajax_contacts_table',
			method: "POST",
			dataType: 'text',
			beforeSend: function() {

			},
			success: function (response) {
				$(content_id).html(response);
				
			},
			complete: function() {
				// $('#users_tbl_id').DataTable();
				$(content_id).addClass('col-md-offset-3 col-md-6');
				$(page_title_id).addClass('col-md-offset-4 col-md-4')
								.html('<h2> <span class = "glyphicon glyphicon-th-list"></span> Contact List</h2>');
				view_details_btn();
				create_new_contact_btn();
			}
		});
	}

	function view_details_btn() {

		var btn = '.view-user-btn-class';

		$(btn).unbind();
		$(btn).on('click', function(){

			var user_id = $(this).data('id');
			view_user_details_modal(user_id);
		});
	}

	function view_user_details_modal(user_id) {

		var ajax_url = controller + '/view_user_details_modal',
			data_sent = {user_id: user_id};

		$.ajax({
			url: ajax_url,
			method: 'POST',
			data: data_sent,
			dataType: 'html',
			beforeSend: function() {
				modal.show_modal();
			},
			success: function(response) {
				$(main_modal).html(response);
				
				console.log(response);
			},
			complete: function(response) {
				modal.close_modal_trigger();
			}
		});
	}

	function create_new_contact_btn() {

		var create_btn = '#create-btn-id';

		$(create_btn).unbind();
		$(create_btn).click(function(){
			create_modal();

			return false;
		});
	}

	function create_modal() {

		var ajax_url = controller + '/create_new_contact_modal';
  
		$.ajax({
			url: ajax_url,
			method: 'GET',
			dataType: 'html',
			beforeSend: function(){
				modal.show_modal();
			},
			success: function(response){
				$(main_modal).html(response);
			},
			complete: function(response) {
				modal.close_modal_trigger();
				dynamic_form.add_number();
				submit_data();
			}
		});
	}

	function submit_data() {

		var form_id = '#new-contact-form',
			ajax_url = controller + '/insert_data';
		
		
		$(form_id).submit(function(e){
				
			e.preventDefault();

			var data_submitted = $(form_id).serialize();
			var data_sent = {
				data_submitted: data_submitted
			}

			$.ajax({
				url: ajax_url,
				method: 'POST',
				data: data_sent,
				beforeSend: function() {

				},
				success: function(response) {
					console.log(response);
				},
				complete: function(response) {
					init();
				}
			});
		});

	}
	
	var dynamic_form = function() {
		var input_div_mobile = '#mobile-numbers-row-id',
			input_div_tel = '#tel-numbers-row-id',
			remove_btn_mob = '<button class="btn btn-danger btn-sm" type="button" id = "remove-mobile-num-id"><span class="glyphicon glyphicon-minus"></span></button>';

		var size_mobile = $('#added-mobile-form-id').children().length,
			size_tel = $('#added-phone-form-id').children().length;
			
		function add_number(){

			$(input_div_mobile).on('click', '#add-mobile-num-id'  ,function() {
				
				if (size_mobile <= 2) {
					$('#added-mobile-form-id').append($(input_div_mobile).html())
											.find('#add-mobile-num-id')
											.replaceWith(remove_btn_mob);
					$('#added-mobile-form-id').find('label').empty();
					size_mobile += 1;
				} else {
					$(input_div_mobile).find('#add-mobile-num-id').addClass('disabled');
				}
			});
			
			
			$(input_div_tel).on('click', '#add-tel-num-id', function() {
				if (size_tel <= 2) {
					$('#added-phone-form-id').append($(input_div_tel).html())
											.find('#add-tel-num-id')
											.replaceWith(remove_btn_mob);
					$('#added-phone-form-id').find('label').empty();
					size_tel += 1;
				} else {
					$(input_div_tel).find('#add-tel-num-id').addClass('disabled');
				}
					
			});
			

			remove_number();
		}

		function remove_number() {

			$('#added-mobile-form-id').on('click', '#remove-mobile-num-id', function() {
				$(this).parent('.form-group').remove();

				size_mobile = size_mobile - 1;

				if ($(input_div_mobile).find('#add-mobile-num-id').hasClass('disabled')) {
					$(input_div_mobile).find('#add-mobile-num-id').removeClass('disabled');
				}
			});

			$('#added-phone-form-id').on('click', '#remove-mobile-num-id', function() {
				$(this).parent('.form-group').remove();

				size_tel = size_tel - 1;

				if ($(input_div_tel).find('#add-tel-num-id').hasClass('disabled')) {
					$(input_div_tel).find('#add-tel-num-id').removeClass('disabled');
				}
			});
		}

		return {
			add_number: add_number
			
		}
	}();

	

	return {
		init: init,
		modal: modal
		
	}
})();

