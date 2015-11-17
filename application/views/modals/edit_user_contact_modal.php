<div class="modal-dialog" style="width: 800px">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">New Contact</h4>
      </div>
      <?php 
        $attr = array('class'=> 'form-horizontal', 'id' => 'new-contact-form');
        echo form_open('Home/insert_data', $attr);
      ?>
      <div class="modal-body">
        <div class="form-group">
           <label class="col-sm-2 control-label">First Name:</label>
           <div class = "col-md-3">
             <input type="text" name="first_name" class="form-control" value="<?php echo $first_name; ?>" required>
           </div>

            <label class="col-sm-2 control-label">Last Name:</label>
            <div class = "col-md-3">
              <input type="text" name="last_name" class="form-control" value="<?php echo $last_name; ?>" required>
            </div>

        </div>

        <div class="form-group">
           <label class="col-sm-2 control-label">Email:</label>
           <div class = "col-md-6">
             <input class="form-control" name="email" type="email" value="<?php echo $email; ?>" required>
           </div>
        </div>

        <h3 style="padding-top: 10px; padding-bottom:25px;">Contact Numbers</h3>

        <div id = "mobile-numbers-row-id">
          <?php 
            $count = 0;
          foreach ($mobile_details as $mobile_data) { ?>

            <div class="form-group">
              <label class="col-sm-2 control-label">Mobile no:</label>
                <div class = "col-md-3">
                  <input type="number" class="form-control" name="mobile_number[]" value = "<?php echo $mobile_data->number; ?>">
                </div>
                <label class="col-sm-2 control-label">Network:</label>
                <div class = "col-md-3">
                  <select class="form-control" name="mobile_network[]">
                    <?php echo $mobile_data->network; ?>
                  </select>
                </div>
                <?php if ($count == 0 ) { ?>
                  <button class="btn btn-info btn-sm" type="button" id = "add-mobile-num-id"><span class="glyphicon glyphicon-plus"></span></button>
                <?php } else { ?>
                  <button class="btn btn-danger btn-sm" type="button" id = "remove-mobile-num-id"><span class="glyphicon glyphicon-minus"></span></button>
                <?php } ?>
            </div>

          <?php $count++;  } ?>
        </div>

        <div id = "added-mobile-form-id"></div>

        <div id = "tel-numbers-row-id">
          <div class="form-group">
              <label class="col-sm-2 control-label">Telephone no(s):</label>
              <div class = "col-md-3">
                <input type="number" class="form-control" name="phone_number[]">
              </div>
              <label class="col-sm-2 control-label">Network:</label>
              <div class = "col-md-3">
                <select class="form-control" name="phone_network[]">
                  <?php echo $tel_networks_dropdown; ?>
                </select>
              </div>
              <button class="btn btn-info btn-sm" type="button" id = "add-tel-num-id"><span class="glyphicon glyphicon-plus"></span></button>
          </div>
        </div>
        
        <div id = "added-phone-form-id"></div>
        
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-default" id = "btn-close-modal-id" >Close</button>
        <button type="submit" class="btn btn-primary" id = "btn-save-data-id" >Save Contact</button>
      </div>
    </div>
    <?php echo form_close(); ?>
  </div>
</div>