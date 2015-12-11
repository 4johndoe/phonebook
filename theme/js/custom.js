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
				dynamic_form.init();
				submit_data();
			}
		});
	}

	var dynamic_form = function() {
		var input_div_mobile = '#mobile-numbers-row-id',
			input_div_tel = '#tel-numbers-row-id',
			remove_btn_mob = '<button class="btn btn-danger btn-sm" type="button" id = "remove-mobile-num-id"><span class="glyphicon glyphicon-minus"></span></button>';

		var size_mobile, size_tel;

		var add_btn_mobile = '#add-mobile-num-id',
			add_btn_phone = '#add-tel-num-id',
			remove_btn = '#remove-mobile-num-id';

		function init() {

			click(input_div_mobile, add_btn_mobile);
			click(input_div_tel, add_btn_phone);	
		}

		function click(div_wrapper, selector) {

			$(div_wrapper).on('click', selector, function() {
				
				var type = $(this).data('type');

				var $obj = {};
					$obj.number_type = type;
					$obj.number = null;
					$obj.networl = null;
					
				add_number($obj);
				

			});
		}
			
		function add_number($obj){ 
			
			size_mobile = $('#added-mobile-form-id').children().length;
			size_tel = $('#added-phone-form-id').children().length;
			// var number, network, number_type;
				// console.log(typeof $obj)
			
			if ($obj == undefined) {

				$obj = {};
				$obj.number = null;
				$obj.number_type = null;
				$obj.network = null;
			}
			// console.log($obj);
			switch ($obj.number_type) {
				case 'mobile':
						var class_name = 'div-mobile-'+ size_mobile;
						var div_class = '<div class = "'+ class_name +'"></div>';
						var $cloned = $(input_div_mobile).clone(true);

						if (size_mobile <= 2) {

							$('#added-mobile-form-id').append(div_class);
							$('.' + class_name).append($(input_div_mobile).html())
													.find('#add-mobile-num-id')
													.replaceWith(remove_btn_mob);

							$('.' + class_name).find('input.mobile-number').val($obj.number);
							$('.' + class_name).find('select#mobile-network-dropdown').html($obj.network);

							$('#added-mobile-form-id').find('label').empty();

							size_mobile += 1;

						} else {
							$(input_div_mobile).find('#add-mobile-num-id').addClass('disabled');
						}
					break;

				case 'telephone':
						var class_name = 'div-tel-'+ size_tel;
						var div_class = '<div class = "'+ class_name +'"></div>';
						
						if (size_tel <= 1) {

							$('#added-phone-form-id').append(div_class);
							$('.' + class_name).append($(input_div_tel).html())
													.find('#add-tel-num-id')
													.replaceWith(remove_btn_mob);

							$('.' + class_name).find('input.phone-number').val($obj.number);
							$('.' + class_name).find('select#phone-network-dropdown').html($obj.network);

							$('#added-phone-form-id').find('label').empty();

							size_tel += 1;

						} else {
							$(input_div_tel).find('#add-tel-num-id').addClass('disabled');
						}
					break;
				default:
					// do nothing
			}
			
			

			remove_number();
		}

		function remove_number() {
			size_mobile = $('#added-mobile-form-id').children().length;
			size_tel = $('#added-phone-form-id').children().length;

			$('#added-mobile-form-id').on('click', '#remove-mobile-num-id', function() {
				$(this).parent().parent().remove();

				size_mobile = size_mobile - 1;

				if ($(input_div_mobile).find('#add-mobile-num-id').hasClass('disabled')) {
					$(input_div_mobile).find('#add-mobile-num-id').removeClass('disabled');
				}
			});

			$('#added-phone-form-id').on('click', '#remove-mobile-num-id', function() {
				$(this).parent().parent().remove();

				size_tel = size_tel - 1;

				if ($(input_div_tel).find('#add-tel-num-id').hasClass('disabled')) {
					$(input_div_tel).find('#add-tel-num-id').removeClass('disabled');
				}
			});
		}

		return {
			init: init,
			add_number: add_number,

			
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
				complete: function(response) {
					var return_data = $.parseJSON(response.responseText);
					console.log(return_data);
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
					dynamic_form.init();
					_populate($main_modal, parsed_json);

					save();
				}
			});

		}
		// populates each form fields
		function _populate($main_modal, json_data) {
			// console.log(json_data.mobile_details );
			

			// define the input fields
			var $first_name_input = $main_modal.find('input[name=first_name]'),
				$last_name_input = $main_modal.find('input[name=last_name]'),
				$email_input = $main_modal.find('input[name=email]'),
				$user_id_hidden = $main_modal.find('input[name=user_id]');

			//contact details div groups and wrappers
			var $orig_mobile_div = $main_modal.find('div#mobile-numbers-row-id'),
				$orig_phone_div = $main_modal.find('div#tel-numbers-row-id'),
				$mobile_wrapper = $main_modal.find('div#added-mobile-form-id'),
				$phone_wrapper = $main_modal.find('div#added-phone-form-id');
				
				
			var remove_btn_mob = '<button class="btn btn-danger btn-sm" type="button" id = "remove-mobile-num-id"><span class="glyphicon glyphicon-minus"></span></button>';

			var mobile_details = json_data.mobile_details, // arrays containing (objects) the mobile nos of the user
				phone_details = json_data.phone_details; // arrays containing (objects) the phone nos of the user
				
			var count_mobile = mobile_details.length,
				count_phone = phone_details.length;

			var $param = {};
				$param.number_type = null;
				$param.number = null;
				$param.network = null;

				// For mobile numbers
				for (var x in mobile_details) {

					if (x == 0) {

						$orig_mobile_div.find('input.mobile-number').val(mobile_details[x].number)
						$orig_mobile_div.find('#mobile-network-dropdown').html(mobile_details[x].network);

					} else {

						$param.number_type = 'mobile';
						$param.number = mobile_details[x].number;
						$param.network = mobile_details[x].network;

						dynamic_form.add_number($param);

					}
				}
				// console.log(json_data.phone_details);
				// For phone numbers
				for (var y in phone_details) {
					// console.log(phone_details[y].number);
					if (y == 0) {
						$orig_phone_div.find('input.phone-number').val(phone_details[y].number);
						$orig_phone_div.find('#phone-network-dropdown').html(phone_details[y].network);
					} else {
						$param.number_type = 'telephone';
						$param.number = phone_details[y].number;
						$param.network = phone_details[y].network;

						dynamic_form.add_number($param);
					}
				}
			


			$first_name_input.val(json_data.first_name);
			$last_name_input.val(json_data.last_name);
			$email_input.val(json_data.email);
			$user_id_hidden.val(json_data.user_id);
			
			// console.log(json_data.mobile_details[0].number);
		}
		
		function save () {

			$('button#btn-save-data-id').on('click', function(e) {
				e.preventDefault();

				submit();

			});
		}

		function submit() {

			var ajax_url = controller + '/update_contact_details';
			var form_id = '#edit-contact-form';

			var form_data = $(form_id).serialize();

			$.ajax({
				url: ajax_url,
				method: 'POST',
				data: form_data,
				beforeSend: function() {

				},
				success: function(response) {
					console.log(response);
				},
				complete: function(response){

				}
			});
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

