<?php
	
	class Contacts_Model extends CI_Model {

		protected $user_tbl = 'user';
		const DB_NETWORK = 'network';
		const DB_CONTACT = 'contact';

		public function __construct() {
			parent::__construct();

		}

		/* GET */
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
					SELECT `user_id`,`first_name`, `last_name` ,`email`, CONCAT(`first_name`, ' ' ,`last_name`) AS username FROM `user` WHERE `user_id` = ?
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

		public function get_network_name($network_id) {
			$sql = "SELECT `network_name` FROM `network` WHERE `network_id` = ? ";

			$query = $this->db->query($sql, array($network_id));
			$result = $query->row();

			return $result;
		}

		public function get_contact_details_by_filter($user_id = null, $type = null, $network = null) {

			$where_concat = "";

			if ($user_id != null || $user_id != '') {
				$where_concat .= " AND  u.`user_id` = {$user_id}";
			}

			if ($type != null || $type != '') {
				$where_concat .= " AND  n.`type` = '".$type."'";

			}

			if ($network != null || $network != '') {
				$where_concat .= " AND c.`network_id` = {$network_id}";
			}

			$sql = "SELECT u.`user_id`, u.`first_name`, u.`last_name`, u.`email`, c.`contact_no`,n.`network_id`, n.`network_name`, n.`network_code`, n.`type` 
						FROM `user` u
						LEFT JOIN contact c ON u.`user_id` = c.`user_id`
						LEFT JOIN network n ON c.`network_id` = n.`network_id` 
						WHERE u.`user_id` IS NOT NULL {$where_concat}";

			$query = $this->db->query($sql);
			$result = $query->result();

			return $result;

		}

		/* INSERT */
		public function insert_new_user($first_name, $last_name, $email) {

			$sql = 'INSERT INTO `user` (`first_name`, `last_name`, `email`)
					VALUES (?, ?, ?)';

			$escaped_values = array($first_name, $last_name, $email);

			$query = $this->db->query($sql, $escaped_values);

			$result = $this->db->insert_id();

			return $result;
		}

		public function insert_contact($number, $network, $user_id) {

			$sql = "INSERT INTO `contact` (`contact_no`, `network_id`, `user_id`)
					VALUES (?, ?, ?)";
			$escaped_values = array($number, $network, $user_id);

			$query = $this->db->query($sql, $escaped_values);

			$result = $this->db->insert_id();

			return $result;
		}


		/* DELETE */
		public function delete_user($user_id) {

			$sql = "DELETE FROM `user` WHERE `user_id` = ?";

			$query = $this->db->query($sql, array($user_id));

			return 'deleted';
		}

		/* UPDATE */
		public function update_user_details($first_name, $last_name, $email, $user_id) {

			$sql = "UPDATE `user` SET `first_name` = ?, `last_name` = ?, `email` = ? WHERE `user_id` = ?";
			$escaped_values = array($first_name, $last_name, $email, $user_id);

			$query = $this->db->query($sql, $escaped_values);

			return 'success';

		}

		

	}
?>