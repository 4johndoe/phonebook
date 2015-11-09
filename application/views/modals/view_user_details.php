<div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Details</h4>
      </div>
      <?php 
        $attr = array('class'=> 'form-horizontal', 'id' => 'view-details-form');
        echo form_open('', $attr);
      ?>
      <div class="modal-body">
        <div class="form-group">
           <label class="col-sm-2 control-label">Name:</label>
           <div class = "col-md-6">
             <p class="form-control-static"><b><?php echo $user_name; ?></b></p>
           </div>
        </div>
        <div class="form-group">
           <label class="col-sm-2 control-label">Email:</label>
           <div class = "col-md-6">
             <p class="form-control-static"><b><?php echo $email; ?></b></p>
           </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Mobile no(s):</label>
           <div class = "col-md-6">
              <?php  foreach ($mobile_array as $mobile_number):  ?>
                  <p class="form-control-static"><?php echo $mobile_number->number.'   ('.$mobile_number->network.')'; ?></p>
              <?php  endforeach; ?>
             
           </div>
        </div>

        <div class="form-group">
          <label class="col-sm-3 control-label">Telephone no(s):</label>
           <div class = "col-md-6">
              <?php  foreach ($tel_array as $tel_number):  ?>
                  <p class="form-control-static"><?php echo $tel_number->number.'   ('.$tel_number->network.')'; ?></p>
              <?php  endforeach; ?>
             
           </div>
        </div>
        
      </div>
      <?php echo form_close(); ?>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id = "btn-close-modal-id" >Close</button>
      </div>
    </div>
  </div>
</div>