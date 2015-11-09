CREATE TABLE `user` (
	`user_id` INTEGER NOT NULL AUTO_INCREMENT,
	`first_name` VARCHAR(50),
	`last_name` VARCHAR(50),
	`email` VARCHAR(30),
	PRIMARY KEY (`user_id`)
);

CREATE TABLE `network` (
	
	`network_id` INTEGER NOT NULL AUTO_INCREMENT,
	`network_name` VARCHAR(20),
	`network_code` VARCHAR(20),
	`type` VARCHAR(30),
	PRIMARY KEY (`network_id`)
);

CREATE TABLE `contact` (
	`contact_id` INTEGER NOT NULL AUTO_INCREMENT,
	`contact_no` VARCHAR(20),
	`network_id` INTEGER,
	`user_id` INTEGER,
	PRIMARY KEY (`contact_id`),
	FOREIGN KEY (`network_id`) REFERENCES `network` (`network_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`)
);