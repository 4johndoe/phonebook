<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {

	public function __construct() {
		
		parent::__construct();

		$this->load->model('Contacts_Model');
		$main_model = new Contacts_Model();
		$this->main_model = $main_model;

	}

	public function index()
	{
		$title = "PhoneBook Home";
		$data['page_title'] = $title;

		$data['listeners'] = array(
			'Module.Phonebook.init()'
			);

		$this->load->view('layout/header', $data);
		$this->load->view('homepage/index');
		$this->load->view('layout/footer', $data);
	}

	public function ajax_contacts_table() {

		$contacts_model = $this->main_model;
		$get_users = $contacts_model->get_all_users();


		$model_data['users'] = $get_users;

		echo $this->load->view('homepage/users', $model_data);
		
	}

	public function view_user_details_modal() {

		$contacts_model = $this->main_model;
		$user_id = $this->input->post('user_id', TRUE);

		$contact_details = $contacts_model->get_user_details($user_id);
		$user_details = $contacts_model->get_user($user_id);

		$mob_numbers = array(); //array of objects
		$tel_numbers = array(); // array of objects
		

		foreach ($contact_details as $detail){

			switch ($detail->type) {

				case 'mobile':
					$data = $this->obj_parser($detail);
					array_push($mob_numbers, $data);

					break;
				case 'telephone':
					$data = $this->obj_parser($detail);
					array_push($tel_numbers, $data);
					break;
				default:
					$data = $this->obj_parser($detail);
					array_push($mob_numbers, $data);
					
			} // end switch
		}
		
		$model_data['user_name'] = $user_details->username;
		$model_data['email'] = $user_details->email;
		$model_data['mobile_array'] = $mob_numbers;
		$model_data['tel_array'] = $tel_numbers;
		
		echo $this->load->view('modals/view_user_details', $model_data);

	}

	public function obj_parser($obj) {
		$new_obj = (object)[];
		$new_obj->number = $obj->contact_no;
		$new_obj->network = $obj->network_name;

		if (property_exists($obj, 'network_id')) {
			$new_obj->network_id = $obj->network_id;
		}

		return $new_obj;
	}

	public function create_new_contact_modal() {

		$contacts_model = $this->main_model;

		$mobile = $this->get_networks_dropdown_menu('mobile');
		$telephone = $this->get_networks_dropdown_menu('telephone');

		$model_data['mobile_networks_dropdown'] = $mobile;
		$model_data['tel_networks_dropdown'] = $telephone;

		echo $this->load->view('modals/create_new_contact_modal', $model_data);
	}

	public function get_networks_dropdown_menu($filter, $default_select_id = null, $default_select = '--Select--') {

		$contacts_model = $this->main_model;
		$networks_list = $contacts_model->get_networks($filter);

		$options = '';
		if ($default_select_id != null){
			$network_name = $contacts_model->get_network_name($default_select_id);
			$network_name = $network_name->network_name;

			$options .= '<option value = "'.$default_select_id.'" selected>'.$network_name.'</option>';
		} else {
			$options .= '<option value = "">'.$default_select.'</option>';
		}


		foreach ($networks_list as $network) {
			// Avoid concatinating the selected option in the dropdown
			if ($network->network_id != $default_select_id) {
				$options .= '<option value = "'.$network->network_id.'">'.$network->network_name.'</option>';
			}
			
		}

		return $options;

	}

	public function insert_data() {

		$data = $this->input->post();
		$contacts_model = $this->main_model;
		$mobile = (object)[];

		if ($data) {
			extract($data, EXTR_SKIP);

			$user_id = $contacts_model->insert_new_user($first_name, $last_name, $email);

			$counter = 0;
			foreach ($mobile_number as $mobile_number) {
				$number = $mobile_number;
				$network = $mobile_network[$counter];

				$contacts_model->insert_contact($number, $network, $user_id);
				$counter++;
			}

			$counter_phone = 0;
			foreach($phone_number as $phone_number) {
				$phone_no = $phone_number;
				$network_tel = $phone_network[$counter_phone];

				$contacts_model->insert_contact($phone_no, $network_tel, $user_id);
				$counter_phone++;
			}
		}

	}

	public function delete_user_modal() {

		$user_id = $this->input->post('user_id');

		$modal_data['user_id'] = $user_id;
		echo $this->load->view('modals/delete_modal', $modal_data);
	}

	public function delete_data() {
		$user_id = $this->input->post('user_id');
		$contacts_model = $this->main_model;

		$response = $contacts_model->delete_user($user_id);

		echo $response;
	}
	
	//  Retrieve User Contact Data
	public function retrieve_user_data() {

		$contacts_model = $this->main_model;
		$user_id = $this->input->get('user_id');

		$data_array = array();
		$mobile_array = array();
		$phone_array = array();

		$mobile_data = $contacts_model->get_contact_details_by_filter($user_id, "mobile");
		$phone_data = $contacts_model->get_contact_details_by_filter($user_id, "telephone");
		$user_details = $contacts_model->get_user($user_id);

		$mobile = $this->get_networks_dropdown_menu('mobile');
		$telephone = $this->get_networks_dropdown_menu('telephone');

		$model_data['tel_networks_dropdown'] = $telephone;
		
		foreach ($mobile_data as $mob_data) {
			$mobile_obj = new stdClass();
			
			$mobile_dropdown = $this->get_networks_dropdown_menu('mobile', $mob_data->network_id);
			$mobile_obj->number = $mob_data->contact_no;
			$mobile_obj->network = $mobile_dropdown;

			//push object to the mobile array
			array_push($mobile_array, $mobile_obj);
			unset($mobile_obj);
		}

		foreach ($phone_data as $tp_data) {
			$phone_obj = new stdClass();

			$phone_dropdown = $this->get_networks_dropdown_menu('mobile', $tp_data->network_id);
			$phone_obj->number = $mob_data->contact_no;
			$phone_obj->network = $phone_dropdown;

			//push object to the mobile array
			array_push($phone_array, $phone_obj);
			unset($phone_obj);
		}
		
		$data_array['first_name'] = $user_details->first_name;
		$data_array['last_name'] = $user_details->last_name;
		$data_array['email'] = $user_details->email;

		if (sizeof($telephone) == 0) {
			$data_array['phone_details'] = $telephone;
		} else {
			$data_array['phone_details'] = $phone_array;
		}
		$data_array['mobile_details'] = $mobile_array;
		$data_array['phone_details'] = $phone_array;

		$json_encoded = json_encode($data_array);
		echo $json_encoded;
		// echo $this->load->view('modals/edit_user_contact_modal', $data_array);

	}

	// trigger the edit modal view
	public function edit_modal() {

		echo $this->load->view('modals/edit_user_contact_modal');
	}

} // end of class Home

/* End of file welcome.php */
