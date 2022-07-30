var pmtgatewayback = {

      getSec : function(wpgateway){
        this.sec = 0;

        $.ajax({
        type: 'POST',
        url: wpgateway.callenvironment + "/wp-json/bambora-api/v1/router/?mthd=nonce",
        data: '',
        dataType: "json",
        success: function(data, textStatus, jqXHR){
          pmtgatewayback.sec=data;
        },
        error: function (jqXHR, textStatus, errorThrown){
           console.log(errorThrown);
        }});

      },
      init : function(wpgateway) {
        this.getSec(wpgateway);
        //listners
        $("input[value='Refund']").attr('data-running',0);
        $("input[value='Process Payment']").attr('data-running',0);
        $("input[value='Cancel Transaction']").attr('data-running',0);

        /*wpgateway.rtrans.on('change',function(){
            $("input[value='Refund']").click();
        });*/

        $.getScript('/Forms/js/sweetalert2.all.min.js').then(function () {
          pmtgatewayback.Swal = Swal;
          pmtgatewayback.startaction(wpgateway);
        }, function(err){
          console.log('ERROR:' + JSON.stringify(err));
        });

        wpgateway.rtrans.on('change',function(){
          $('#form1').submit();
        });


      },
      startaction : function(wpgateway){
            //bind Refund button
          /*$("input[value='Refund']").on('click',function(e){
              e.preventDefault();
              e.stopImmediatePropagation();
              pmtgatewayback.swal('boo');
          });*/

          $("input[value='Refund']").on('click',function(e){
            if($(this).attr('data-running') == '0'){
              e.preventDefault();
              //e.stopImmediatePropagation();
              //e.stopPropagation();
              $("input[value='Refund']").attr('data-running',1);
              $('#form1').parsley().validate();

              var noErrors = true;
              $('.parsley-error').each(function() {
                noErrors = false;
              });

              if (noErrors) {

                  pmtgatewayback.Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to process a refund of $"+wpgateway.refund.val()+" to the order "+wpgateway.order.val(),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, refund it!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      pmtgatewayback.makeRefund(wpgateway);
                      pmtgatewayback.Swal.fire({
                        title: 'Processing Refund, Do Not Close Window...',
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false
                      });
                    } else {
                      $("input[value='Refund']").attr('data-running',0);
                    }
                  })

               } else {
                  $("input[value='Refund']").attr('data-running',0);
               }
            }
          });

          $("input[value='Process Payment']").on('click',function(e){
            if($(this).attr('data-running') == '0'){
              e.preventDefault();
              //e.stopImmediatePropagation();
              //e.stopPropagation();
              $("input[value='Process Payment']").attr('data-running',1);
              $('#form1').parsley().validate();

              var noErrors = true;
              $('.parsley-error').each(function() {
                noErrors = false;
              });

              if (noErrors) {

                  pmtgatewayback.Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to process the payment for $"+wpgateway.total.val()+" to the order "+wpgateway.order.val(),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, charge it!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      pmtgatewayback.procesPreAuth(wpgateway);
                      pmtgatewayback.Swal.fire({
                        title: 'Processing Payment, Do Not Close Window...',
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false
                      });
                    } else {
                      $("input[value='Process Payment']").attr('data-running',0);
                    }
                  })

               } else {
                  $("input[value='Process Payment']").attr('data-running',0);
               }
            }
          });

          $("input[value='Cancel Transaction']").on('click',function(e){

			$("input[value='Refund']").prop('disabled',true);
			$("input[value='Process Payment']").prop('disabled',true);
			$("input[value='Cancel Transaction']").prop('disabled',true);			  
			  
            if($(this).attr('data-running') == '0'){
              e.preventDefault();
              //e.stopImmediatePropagation();
              //e.stopPropagation();
              $("input[value='Cancel Transaction']").attr('data-running',1);
              $('#form1').parsley().validate();

              var noErrors = true;
              $('.parsley-error').each(function() {
                noErrors = false;
              });

              if (noErrors) {

                  pmtgatewayback.Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to cancel the payment on this order "+wpgateway.order.val(),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, void it!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      pmtgatewayback.voidPreAuth(wpgateway);
                      pmtgatewayback.Swal.fire({
                        title: 'Processing Cancellation, Do Not Close Window...',
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false
                      });
                    } else {
                      $("input[value='Cancel Transaction']").attr('data-running',0);
                    }
                  })

               } else {
                  $("input[value='Cancel Transaction']").attr('data-running',0);
               }
            }
          });

          $("input[value='Refund']").prop('disabled',false);
          $("input[value='Process Payment']").prop('disabled',false);
          $("input[value='Cancel Transaction']").prop('disabled',false);
      },
      makeRefund : function(wpgateway){

          var parsetransaction = JSON.parse(wpgateway.transaction.val());

          $.ajax({
            type: 'POST',
            url: wpgateway.callenvironment + "/wp-json/bambora-api/v1/router/?mthd=reftranbam",
            data: {
              'amount' : wpgateway.refund.val(),
              'transaction' : parsetransaction.id,
              '_wpnonce' : pmtgatewayback.sec
            },
            success: function(data, textStatus, jqXHR){
                //console.log(data);
                if(data.response.hasOwnProperty('code')){
                  pmtgatewayback.Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.response.message,
                    footer: 'Please Validate The Transaction With The Bank'
                  })
                } else if(data.response.hasOwnProperty('approved') && data.response.approved === 1) {
                  wpgateway.rtrans.val(JSON.stringify(data.response)).change();
                  pmtgatewayback.Swal.close();
                } else {
                  pmtgatewayback.Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'There was a data or communication errror',
                    footer: 'Please Validate The Transaction With The Bank'
                  })
                }
            },
            error: function (jqXHR, textStatus, errorThrown){
                pmtgatewayback.Swal.close();
                $("input[value='Refund']").attr('data-running',0);
                console.log(errorThrown);
            }});

      },
	  procesPreAuth : function(wpgateway){

          var parsetransaction = JSON.parse(wpgateway.transaction.val());

          $.ajax({
            type: 'POST',
            url: wpgateway.callenvironment + "/wp-json/bambora-api/v1/router/?mthd=comp",
            data: {
              'amount' : wpgateway.total.val(),
              'transaction' : parsetransaction.id,
              '_wpnonce' : pmtgatewayback.sec
            },
            success: function(data, textStatus, jqXHR){
                //console.log(data);
                if(data.response.hasOwnProperty('code')){
                  pmtgatewayback.Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.response.message,
                    footer: 'Please Validate The Transaction With The Bank'
                  })
                } else if(data.response.hasOwnProperty('message') && data.response.message === 'Approved') {
                  wpgateway.rtrans.val(JSON.stringify(data.response)).change();
                  pmtgatewayback.Swal.close();
                } else {
                  pmtgatewayback.Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'There was a data or communication errror',
                    footer: 'Please Validate The Transaction With The Bank'
                  })
                }
            },
            error: function (jqXHR, textStatus, errorThrown){
                pmtgatewayback.Swal.close();
                $("input[value='Process Payment']").attr('data-running',0);
                console.log(errorThrown);
            }});

	  },
	  voidPreAuth : function(wpgateway){

          var parsetransaction = JSON.parse(wpgateway.transaction.val());

          $.ajax({
            type: 'POST',
            url: wpgateway.callenvironment + "/wp-json/bambora-api/v1/router/?mthd=voidtranbam",
            data: {
              'transaction' : parsetransaction.id,
			  'amount' : wpgateway.total.val(),
              'order_number' : wpgateway.order.val(),
              '_wpnonce' : pmtgatewayback.sec
            },
            success: function(data, textStatus, jqXHR){
                //console.log(data);
                if(data.response.hasOwnProperty('code')){
                  pmtgatewayback.Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.response.message,
                    footer: 'Please Validate The Transaction With The Bank'
                  })
                } else if(data.response.hasOwnProperty('message') && data.response.message === 'Approved') {
                  wpgateway.rtrans.val(JSON.stringify(data.response)).change();
                  pmtgatewayback.Swal.close();
                } else {
                  pmtgatewayback.Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'There was a data or communication errror',
                    footer: 'Please Validate The Transaction With The Bank'
                  })
                }
            },
            error: function (jqXHR, textStatus, errorThrown){
                pmtgatewayback.Swal.close();
                $("input[value='Cancel Transaction']").attr('data-running',0);
                console.log(errorThrown);
            }});

	  }

}