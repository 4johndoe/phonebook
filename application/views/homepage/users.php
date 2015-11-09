
	<table id = "users_tbl_id" class="table table-hover table-striped">
		<thead>
			<th>No.</th>
			<th>Name</th>
			<th>Action</th>
		</thead>

		<tbody>

			<?php foreach($users as $user) {
				
			?>

			<tr>
				<td><?php echo $user->user_id; ?></td>
				<td><a class="btn btn-link view-user-btn-class" data-id = "<?php echo $user->user_id; ?>">
					<?php echo $user->username; ?>
					</a></td>
				<td>
					<button type = "button" class="btn btn-danger btn-sm"><span class = "glyphicon glyphicon-trash"></span></button>
				</td>
			<tr>
			
			<?php } ?>
		</tbody>

	</table>
