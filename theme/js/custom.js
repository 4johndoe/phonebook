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
			$(main_modal).html('');
			$(main_modal).modal('hide');
			
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
				delete_functions.delete_user();
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
			},
			complete: function(response) {
				modal.close_modal_trigger();
				edit_functions.init(user_id);
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

	function submit_data() {

		var form_id = '#new-contact-form',
			ajax_url = controller + '/insert_data';
		
		var saving_btn = '<button type="button" class="btn btn-primary" disabled = "disabled">Saving..</button>';
		$(form_id).submit(function(e){
				
			e.preventDefault();

			var data_submitted = $(form_id).serialize();
				
			$.ajax({
				url: ajax_url,
				method: 'POST',
				data: data_submitted,
				beforeSend: function() {
					$('.modal-footer').find('#btn-save-data-id').replaceWith(saving_btn);
				},
				success: function(response) {
					modal.hide_modal();
					console.log(response);
				},
				complete: function(response) {
					init();
				}
			});
		});

	}

	var delete_functions = function() {

		var default_del_btn = '#delete-user-btn';

		function delete_user() {
			
			$('#homepage-content').off('click', default_del_btn);
			$('#homepage-content').on('click', default_del_btn, function() {

				var user_id = $(this).data('id');

				delete_modal(user_id)
			});

		}

		function delete_modal(user_id) {
			var ajax_url = controller + '/delete_user_modal';

			$.ajax({
				url: ajax_url,
				method: 'POST',
				data: {user_id: user_id},
				dataType: 'html',
				beforeSend: function() {
					modal.show_modal();
				},
				success: function(response) {
					$(main_modal).html(response);
				},
				complete: function(response) {
					delete_data(user_id);
				}
			});
		}

		function delete_data(id) {

			var ajax_url = controller + '/delete_data',
				btn_yes  = '.btn_yes';

			$(btn_yes).on('click', function() {

				$.ajax({
					url: ajax_url,
					method: 'POST',
					data: {user_id: id},
					beforeSend: function() {
						$(btn_yes).text('Deleting..');
					},
					success: function(response) {
						console.log(response);
						modal.hide_modal();
					},
					complete: function(response) {
						init();
					}
				});
			});
			
		}

		return {
			delete_user: delete_user,
			delete_modal: delete_modal
		}
	}();

	var edit_functions = function() {

		var default_edit_btn = '#btn-edit-id',
			$main_modal = $(main_modal);

		function init(user_id) {
			
			$(default_edit_btn).on('click', function() {
				retrieve_user_data(user_id);
				
			});
		}

		//trigger retrieve current user data
		function retrieve_user_data(id) {

			var ajax_url = controller + '/retrieve_user_data';

			$.ajax({
				url: ajax_url,
				method: 'GET',
				data: {user_id: id},
				dataType: 'json',
				success: function(response) {
					// $(main_modal).html(response);
					// console.log(respose);
				},
				complete: function(response) {
					var return_data = $.parseJSON(response.responseText);
					// console.log(return_data);
					populate_modal(return_data);
				}

			});
		}

		//populate modal from parsed json data
		function populate_modal(parsed_json) {

			var ajax_url = controller + '/edit_modal';

			$.ajax({
				url: ajax_url,
				method: 'GET',
				dataType: 'html',
				beforeSend: function(){
					modal.show_modal();
				},
				success: function(response) {
					$main_modal.html(response);
				},
				complete: function(response) {
					_populate($main_modal, parsed_json);
					dynamic_form.add_number();

				}
			});

		}

		function _populate($main_modal, json_data) {
			console.log(json_data);

			// define the input fields
			var $first_name_input = $main_modal.find('input[name=first_name]'),
				$last_name_input = $main_modal.find('input[name=last_name]'),
				$email_input = $main_modal.find('input[name=email]');

			//contact details div groups and wrappers
			var $orig_mobile_div = $main_modal.find('div#mobile-numbers-row-id'),
				$orig_phone_div = $main_modal.find('div#tel-numbers-row-id'),
				$mobile_wrapper = $main_modal.find('div#added-mobile-form-id'),
				$phone_wrapper = $main_modal.find('div#added-phone-form-id');
				
				
			var remove_btn_mob = '<button class="btn btn-danger btn-sm" type="button" id = "remove-mobile-num-id"><span class="glyphicon glyphicon-minus"></span></button>';

			var mobile_details = json_data.mobile_details, // arrays containing (objects) the mobile nos of the user
				phone_details = json_data.phone_details; // arrays containing (objects) the phone nos of the user


			for (var i in mobile_details) {
				
				if (i == 0 ) {
					$orig_mobile_div.find('input.mobile-number').val(mobile_details[i].number);
					$orig_mobile_div.find('#mobile-network-dropdown').html(mobile_details[i].network);
				} else {
					var class_name = 'div-'+ i
						append_div = '<div id = "'+ class_name +'"></div>';

					$mobile_wrapper.append(append_div);
					$('#'+class_name).append($orig_mobile_div.html()).find('input.mobile-number').val(mobile_details[i].number);
					$('#'+class_name).find('#mobile-network-dropdown').html(mobile_details[i].network);
					$('#'+class_name).find('label').empty();
					$('#'+class_name).find('#add-mobile-num-id').replaceWith(remove_btn_mob);
				}

				console.log(mobile_details[i].number);
			}

			for (var v in phone_details) {
				
				if (v == 0 ) {
					$orig_phone_div.find('input.phone-number').val(phone_details[v].number);
					$orig_phone_div.find('#phone-network-dropdown').html(phone_details[v].network);
				} else {
					var class_name = 'div-'+ v,
						append_div = '<div id = "'+ class_name +'"></div>';

					$phone_wrapper.append(append_div);
					$('#'+class_name).append($orig_phone_div.html()).find('input.phone-number').val(phone_details[v].number);
					$('#'+class_name).find('#phone-network-dropdown').html(phone_details[v].network);
					$('#'+class_name).find('label').empty();
					$('#'+class_name).find('#add-mobile-num-id').replaceWith(remove_btn_mob);
				}

				console.log(phone_details[v].number);
			}

			$first_name_input.val(json_data.first_name);
			$last_name_input.val(json_data.last_name);
			$email_input.val(json_data.email);
			
			// console.log(json_data.mobile_details[0].number);
		}
		

		return {
			init: init
		}
	}();

	return {
		init: init,
		modal: modal,
		
	}
})();

