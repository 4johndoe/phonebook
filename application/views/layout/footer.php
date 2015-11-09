</div> <!--end of class container-->
    

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="theme/js/jquery-1.11.3.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="theme/js/bootstrap.min.js"></script>
    <script src = "theme/js/custom.js"></script>

    <script src = "theme/js/jquery.dataTables.min.js"></script>
    


    <!--js listeners-->
    <?php 
    	$controller = $this->uri->segment(1, '');
    ?>

    <?php if(isset($listeners)) : ?>
    <script type="text/javascript">

        $(document).ready(function(){
            Module.Phonebook.init();
            <?php foreach ($listeners as $listener) : 
                print($listener);
            endforeach; ?>
        });
    </script>
    <?php endif; ?>
  </body>
</html>