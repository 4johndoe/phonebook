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

	public function get_networks_dropdown_menu($filter, $default_select = '--Select--', $default_select_id = null) {

		$contacts_model = $this->main_model;
		$networks_list = $contacts_model->get_networks($filter);

		$options = '';
		if ($default_select_id != null){
			$options .= '<option value = "'.$default_select_id.'">'.$default_select.'</option>';
		} else {
			$options .= '<option value = "">'.$default_select.'</option>';
		}


		foreach ($networks_list as $network) {
			$options .= '<option>'.$network->network_name.'</option>';
		}

		return $options;

	}

	public function insert_data() {

		$data = $this->input->post();
		$contacts_model = $this->main_model;

		if ($data) {

			extract($data, EXTR_SKIP);

			$contact_id = $contacts_model->insert_contact();
		}
		
	}

	

} // end of class Home

/* End of file welcome.php */
