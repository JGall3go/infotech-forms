
let forms = document.querySelectorAll(".form")

for(let form in forms) {
    let form_data = forms[form].querySelector(".form-data")
    let button_form = form_data.querySelector(".button-form")
    console.log(button_form)

    anime({
        targets: button_form,
        translateY: '-55px',
        easing: 'easeInOutQuad'
    });
    let button_see = form_data.querySelector(".button-see")
    let button_download = form_data.querySelector(".button-download")
}

function button_animation() {
    
}
//.addEventListener("mouseover", button_delay1);

console.log(forms)