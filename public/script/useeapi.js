// "use strict";

// Custom model popup ------------------------------
const usee_modalTriggers = document.querySelectorAll(".usee-popup-trigger_");
const usee_modalCloseTrigger = document.querySelector(".usee_popup__close");
const usee_bg_overlay = document.querySelector(".usee-bg-popup-overlay_");

usee_modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const { popupTrigger } = trigger.dataset;
    const usee_popupModal = document.querySelector(
      `[data-popup-modal="${popupTrigger}"]`
    );

    usee_popupModal.classList.add("is--visible");
    usee_bg_overlay.classList.add("is-blacked-out");

    setTimeout(function(){ 
       var usee_screenheight=screen.height; 
       if(usee_screenheight>800)
       {
       var usee_popup_height=usee_screenheight-(usee_screenheight/4);
       }
       else
       {
        var usee_popup_height=usee_screenheight-50;
       }
    //   $('.u-see-agent-website-popup_').height(usee_popup_height+'px');
       document.querySelector('.u-see-agent-website-popup_').style.height=usee_popup_height+ "px";

      //var popup_height = $('.u-see-agent-website-popup_').height();
    //  $('iframe.usee-agent-popup-iframe').css('height', usee_popup_height+'px' );
       document.querySelector('.usee-agent-popup-iframe').style.height=((usee_popup_height) + "px");
       document.querySelector('.usee-agent-popup-iframe').style.display = 'block';
    //  $('iframe.usee-agent-popup-iframe').show();

    }, 700 );

    usee_modalCloseTrigger.addEventListener("click", () => {
        usee_popupModal.classList.remove("is--visible");
        usee_bg_overlay.classList.remove("is-blacked-out");
    });

    usee_bg_overlay.addEventListener("click", () => {
      // TODO: Turn into a function to close modal
      usee_popupModal.classList.remove("is--visible");
      usee_bg_overlay.classList.remove("is-blacked-out");
    });
  });
});
// -------------------------------------------------