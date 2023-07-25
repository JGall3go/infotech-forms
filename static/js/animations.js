
let forms = document.querySelectorAll(".form")

for(let form in forms) {

    let form_data = forms[form].querySelector(".form-data")

    let button_form = form_data.querySelector(".button-form")
    let button_see = form_data.querySelector(".button-see")
    let button_download = form_data.querySelector(".button-download")
    let button_logs = form_data.querySelector(".button-logs")

    forms[form].addEventListener("mouseenter", button_animation_over);
    forms[form].addEventListener("mouseleave", button_animation_out);

    function button_animation_over() {

        anime.remove(button_form);
        anime.remove(button_see);
        anime.remove(button_download);
        anime.remove(button_logs);

        anime({ // Button Form
            targets: button_form,
            translateY: '-65px',
            delay: 50
        });

        anime({ // Button See
            targets: button_see,
            translateY: '-65px',
            delay: 100
        });

        anime({ // Button Download
            targets: button_download,
            translateY: '-65px',
            delay: 150
        });

        anime({ // Button Logs
            targets: button_logs,
            translateY: '-65px',
            delay: 200
        });
    }

    function button_animation_out() {

        anime.remove(button_form);
        anime.remove(button_see);
        anime.remove(button_download);
        anime.remove(button_logs);

        anime({ // Button Form
            targets: button_form,
            translateY: '15px',
        });

        anime({ // Button See
            targets: button_see,
            translateY: '15px',
        });

        anime({ // Button Download
            targets: button_download,
            translateY: '15px',
        });

        anime({ // Button Logs
            targets: button_logs,
            translateY: '15px',
        }); 
    }
}