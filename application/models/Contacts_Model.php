<?php
	
	class Contacts_Model extends CI_Model {

		protected $user_tbl = 'user';
		const DB_NETWORK = 'network';
		const DB_CONTACT = 'contact';

		public function __construct() {
			parent::__construct();

		}

		public function get_all_users() {

			$sql = "
				SELECT `user_id`, CONCAT(`first_name`, ' ' ,`last_name`) AS username FROM `user`;
			";

			$query = $this->db->query($sql);

			$result = $query->result();

			return $result;

		}

		public function get_user($user_id) {
			$sql = "
					SELECT `user_id`, `email`, CONCAT(`first_name`, ' ' ,`last_name`) AS username FROM `user` WHERE `user_id` = ?
				";

			$query = $this->db->query($sql, array($user_id));
			$result = $query->row();

			return $result;
		}

		public function get_user_details($user_id) {

			$sql = "SELECT u.`user_id`,	c.`contact_no`, n.`network_name`, n.`network_code`, n.`type` 
						FROM `user` u
							LEFT JOIN contact c ON u.`user_id` = c.`user_id`
							LEFT JOIN network n ON c.`network_id` = n.`network_id`
					 WHERE u.`user_id` = ? ";

			$escaped_value = array($user_id);
			$query = $this->db->query($sql, $escaped_value);
			$result = $query->result();

			return $result;
		}

		public function get_networks($type) {
			
			$sql = "SELECT * FROM `network` WHERE `type` = ?";

			$query = $this->db->query($sql, array($type));
			$result = $query->result();

			return $result;
		}

	}
?>