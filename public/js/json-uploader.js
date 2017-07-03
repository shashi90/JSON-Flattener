// Image Upload
var JSON_UPLOADER = JSON_UPLOADER || (function() {
    return {
        upload: function(e, done) {
            var oFile = e.target.files[0];
            /*if(oFile.size/1024 > 1024) {
                $('#imageAlert').html("The Image size should be less than 300KB")
                $('#imageAlert').fadeIn();
                $timeout(function(){
                    $('#imageAlert').fadeOut(); 
                }, 1500);
                return;
            }*/
            var formData = new FormData();
            formData.append("file", oFile);
            jQuery.ajax({
                url: '/json/upload?filename='+oFile.name,
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                success: function(response) {
                    if(response.status == 1) {
                        done(response.jsonObj, response.jsonFiles);
                    }
                },
                error: function(errResponse) {
                    console.log(errResponse);
                }
            });
        },
    }
}());