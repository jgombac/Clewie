(function ($) {
    $.fn.modal = function (action, callback) {

        action = action || 'init';

        // Defining elements for this modal
        var self = this,
            modalName = self.attr('id'),
            modalBtnShow = $('[data-gom-toggle="modal"][data-gom-target="' + modalName + '"]'),
            modalBtnHide = $('[data-gom-dismiss="modal"]', self),
            modalLevel = modalBtnShow.attr('data-gom-level'),
            modalIndexZ;

        //// Check if there is a buton for this modal
        //if (!modalBtnShow.attr('data-gt-target') && typeof callback === 'number') {
        //    modalLevel = callback;
        //}



        // Z-INDEX - check and fallback
        if (typeof modalLevel !== typeof undefined && modalLevel !== false) {
            if (modalLevel == '' || modalLevel == 1) {
                modalIndexZ = 2000;
            } else if (modalLevel == 2) {
                modalIndexZ = 2100;
            } else if (modalLevel == 3) {
                modalIndexZ = 2200;
            } else if (modalLevel == 4) {
                modalIndexZ = 2300;
            } else if (modalLevel == 5) {
                modalIndexZ = 2400;
            } else {
                console.log('Level number can be between 1 and 5, depicting the height of the modal respectivly.\nValue 5 will be set.');
                modalIndexZ = 2400;
            }
        } else {
            modalIndexZ = 2000;
        }

        // INIT - default init and setup for modal. Click events are activated here 
        if (action === 'init') {
            modalBtnShow.click(function (e) {
                e.preventDefault();

                self.css('z-index', modalIndexZ);
                self.show();
                $('body').addClass('modal-level-' + modalLevel);
                setTimeout(function () {
                    self.addClass('modal-open');
                }, 100);

            });

            modalBtnHide.click(function (e) {
                e.preventDefault();
                

                self.removeClass('modal-open');
                setTimeout(function () {
                    self.hide();
                    $('body').removeClass('modal-level-' + modalLevel);
                }, 250);

            });
        }

        // SHOW
        if (action === 'show') {
            // Event
            self.css('z-index', modalIndexZ);
            self.show();
            $('body').addClass('modal-level-' + modalLevel);
            setTimeout(function () {
                self.addClass('modal-open');
            }, 100);

            // Callback
            if (typeof callback == 'function') {
                callback();
            }
        }

        // HIDE
        if (action === 'hide') {


            // Event
            self.removeClass('modal-open');

            $('body').removeClass('modal-level-' + modalLevel);
            setTimeout(function () {
                self.hide();
            }, 250);


            // Callback
            if (typeof callback == 'function') {
                callback();
            }
        }

        // ONSHOW
        if (action === 'onShow' && typeof callback === 'function') {
            modalBtnShow.on('click', function (e) {
                callback();
            });
        }

        // ONHIDE
        if (action === 'onHide' && typeof callback === 'function') {
            modalBtnHide.on('click', function (e) {
                callback();
            });
        }

        return this;
    }

})(jQuery);