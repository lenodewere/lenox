'use strict';

/* =========================================
   NAVBAR TOGGLE
========================================= */

const header = document.querySelector('[data-header]');
const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbarLinks = document.querySelectorAll('[data-nav-link]');

if (navToggleBtn && header) {
    navToggleBtn.addEventListener('click', () => {
        const isActive = header.classList.toggle('nav-active');

        navToggleBtn.classList.toggle('active');
        navToggleBtn.setAttribute(
            'aria-expanded',
            isActive ? 'true' : 'false'
        );
    });
}


/* =========================================
   CLOSE NAVBAR ON LINK CLICK
========================================= */

navbarLinks.forEach(link => {
    link.addEventListener('click', () => {

        if (header) {
            header.classList.remove('nav-active');
        }

        if (navToggleBtn) {
            navToggleBtn.classList.remove('active');
            navToggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
});


/* =========================================
   HEADER & BACK TO TOP
========================================= */

const backTopBtn = document.querySelector('[data-back-to-top]');

function handleScroll() {

    const scrolled = window.scrollY >= 100;

    if (header) {
        header.classList.toggle('active', scrolled);
    }

    if (backTopBtn) {
        backTopBtn.classList.toggle('active', scrolled);
    }
}

window.addEventListener('scroll', handleScroll);
handleScroll();


/* =========================================
   BACK TO TOP
========================================= */

if (backTopBtn) {

    backTopBtn.addEventListener('click', event => {

        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* =========================================
   CLOSE MOBILE NAVBAR ON RESIZE
========================================= */

window.addEventListener('resize', () => {

    if (window.innerWidth >= 992) {

        if (header) {
            header.classList.remove('nav-active');
        }

        if (navToggleBtn) {
            navToggleBtn.classList.remove('active');

            navToggleBtn.setAttribute(
                'aria-expanded',
                'false'
            );
        }
    }
});


/* =========================================
   COPY PAYMENT DETAILS
========================================= */

const copyButtons = document.querySelectorAll('.copy-payment');

copyButtons.forEach(button => {

    button.addEventListener('click', async () => {

        const value = button.dataset.copy;

        if (!value) return;

        const originalText = button.innerHTML;

        try {

            await navigator.clipboard.writeText(value);

            button.innerHTML =
                '<ion-icon name="checkmark-outline"></ion-icon> Copied!';

            button.classList.add('copied');

            setTimeout(() => {

                button.innerHTML = originalText;
                button.classList.remove('copied');

            }, 2000);

        } catch (error) {

            const textArea = document.createElement('textarea');

            textArea.value = value;

            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';

            document.body.appendChild(textArea);

            textArea.select();

            try {

                document.execCommand('copy');

                button.innerHTML =
                    '<ion-icon name="checkmark-outline"></ion-icon> Copied!';

                button.classList.add('copied');

                setTimeout(() => {

                    button.innerHTML = originalText;
                    button.classList.remove('copied');

                }, 2000);

            } catch (copyError) {

                alert(
                    `Copy failed. Please copy this manually:\n${value}`
                );
            }

            document.body.removeChild(textArea);
        }
    });
});


/* =========================================
   FORMSPREE HELPER
========================================= */

async function submitToFormspree(form) {

    const formData = new FormData(form);

    /*
     * Formspree works best when the request explicitly
     * asks for a JSON response.
     */

    const response = await fetch(form.action, {

        method: 'POST',

        body: formData,

        headers: {
            'Accept': 'application/json'
        }
    });

    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    return {
        response,
        data
    };
}


/* =========================================
   CONTACT FORM
========================================= */

const contactForm =
    document.querySelector('.contact-form');

if (contactForm) {

    const submitBtn =
        contactForm.querySelector('.btn-submit');

    let status =
        contactForm.querySelector('.form-status');

    if (!status) {

        status = document.createElement('p');

        status.className = 'form-status';

        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');

        contactForm.appendChild(status);
    }


    contactForm.addEventListener('submit', async event => {

        event.preventDefault();

        if (!submitBtn || submitBtn.disabled) return;


        /* Reset status */

        status.textContent = '';
        status.className = 'form-status';


        /* Loading */

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML =
            '<span>Sending...</span>';


        try {

            const {
                response,
                data
            } = await submitToFormspree(contactForm);


            if (response.ok) {

                status.textContent =
                    'Message sent successfully! I’ll get back to you as soon as possible.';

                status.classList.add('success');

                contactForm.reset();

            } else {

                let message =
                    'Something went wrong. Please try again.';

                if (data && Array.isArray(data.errors)) {

                    message = data.errors
                        .map(error => error.message)
                        .join(', ');
                }

                console.error(
                    'Contact Formspree Error:',
                    response.status,
                    data
                );

                status.textContent = message;
                status.classList.add('error');
            }

        } catch (error) {

            console.error(
                'Contact form network error:',
                error
            );

            status.textContent =
                'Unable to connect to the form service. Please check your internet connection and try again.';

            status.classList.add('error');

        } finally {

            submitBtn.disabled = false;

            submitBtn.classList.remove('loading');

            submitBtn.innerHTML = originalText;
        }

    });
}


/* =========================================
   PAYMENT CONFIRMATION
========================================= */

const paymentForm = document.getElementById(
    'paymentConfirmationForm'
);

const paymentSuccess = document.getElementById(
    'paymentSuccess'
);

const paymentSubmit = document.getElementById(
    'paymentSubmit'
);

const paymentStatus = document.getElementById(
    'paymentFormStatus'
);

const newPaymentConfirmation = document.getElementById(
    'newPaymentConfirmation'
);


if (paymentForm) {

    paymentForm.addEventListener('submit', async function (event) {

        event.preventDefault();

        if (paymentSubmit.disabled) {
            return;
        }

        /* Clear previous message */
        paymentStatus.textContent = '';
        paymentStatus.className = 'form-status';

        /* Disable button */
        paymentSubmit.disabled = true;
        paymentSubmit.classList.add('loading');

        const originalButtonText = paymentSubmit.innerHTML;

        paymentSubmit.innerHTML =
            '<ion-icon name="hourglass-outline"></ion-icon> Sending...';


        /* Collect form information */
        const formData = new FormData(paymentForm);

        const clientName =
            document.getElementById('paymentName').value.trim();

        const transactionCode =
            document.getElementById('transactionCode').value.trim();

        const amount =
            document.getElementById('paymentAmount').value.trim();


        try {

            const response = await fetch(
                paymentForm.action,
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );


            /* =====================================
               SUCCESS
            ===================================== */

            if (response.ok) {

                const successName =
                    document.getElementById(
                        'successClientName'
                    );

                const successReference =
                    document.getElementById(
                        'successReference'
                    );

                const successAmount =
                    document.getElementById(
                        'successAmount'
                    );


                if (successName) {
                    successName.textContent =
                        clientName || 'Client';
                }


                if (successReference) {
                    successReference.textContent =
                        transactionCode || 'Submitted';
                }


                if (successAmount) {

                    const numericAmount =
                        Number(amount);

                    if (
                        Number.isFinite(numericAmount) &&
                        numericAmount > 0
                    ) {

                        successAmount.textContent =
                            `KSh ${numericAmount.toLocaleString()}`;

                    } else {

                        successAmount.textContent =
                            `KSh ${amount}`;

                    }
                }


                /* Hide form */
                paymentForm.hidden = true;


                /* Show success message */
                paymentSuccess.hidden = false;


                /* Scroll to success */
                setTimeout(() => {

                    paymentSuccess.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                }, 150);


            } else {

                /* =================================
                   FORMSPREE ERROR
                ================================= */

                let errorMessage =
                    'Something went wrong. Please try again.';

                try {

                    const data =
                        await response.json();

                    if (
                        data &&
                        Array.isArray(data.errors) &&
                        data.errors.length
                    ) {

                        errorMessage =
                            data.errors
                                .map(error => error.message)
                                .join(', ');
                    }

                } catch (error) {

                    console.error(
                        'Could not read Formspree error:',
                        error
                    );

                }


                paymentStatus.textContent =
                    errorMessage;

                paymentStatus.classList.add(
                    'error'
                );


                console.error(
                    'Formspree response:',
                    response.status,
                    response.statusText
                );
            }


        } catch (error) {

            /* =================================
               CONNECTION ERROR
            ================================= */

            console.error(
                'Payment submission error:',
                error
            );

            paymentStatus.textContent =
                'Unable to submit your confirmation. Please check your internet connection and try again.';

            paymentStatus.classList.add(
                'error'
            );


        } finally {

            paymentSubmit.disabled = false;

            paymentSubmit.classList.remove(
                'loading'
            );

            paymentSubmit.innerHTML =
                originalButtonText;

        }

    });

}


/* =========================================
   SUBMIT ANOTHER PAYMENT
========================================= */

if (newPaymentConfirmation) {

    newPaymentConfirmation.addEventListener(
        'click',
        function () {

            paymentSuccess.hidden = true;

            paymentForm.hidden = false;

            paymentForm.reset();

            paymentStatus.textContent = '';

            paymentStatus.className =
                'form-status';


            paymentForm.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }
    );

}
            /* =====================================
               SUCCESS
            ===================================== */

            if (response.ok) {

                const successName =
                    document.querySelector(
                        '#successClientName'
                    );

                const successReference =
                    document.querySelector(
                        '#successReference'
                    );

                const successAmount =
                    document.querySelector(
                        '#successAmount'
                    );


                if (successName) {

                    successName.textContent =
                        clientName;
                }


                if (successReference) {

                    successReference.textContent =
                        transactionCode;
                }


                if (successAmount) {

                    const numericAmount =
                        Number(amount);

                    successAmount.textContent =
                        Number.isFinite(numericAmount)
                            ? `KSh ${numericAmount.toLocaleString()}`
                            : `KSh ${amount}`;
                }


                /* Hide form */

                paymentForm.hidden = true;


                /* Show success */

                paymentSuccess.hidden = false;


                /* Scroll */

                setTimeout(() => {

                    paymentSuccess.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                }, 100);

            }


            /* =====================================
               FORMSPREE ERROR
            ===================================== */

            else {

                let errorMessage =
                    'Something went wrong. Please try again.';


                if (
                    data &&
                    Array.isArray(data.errors)
                ) {

                    errorMessage =
                        data.errors
                            .map(error => error.message)
                            .join(', ');
                }


                console.error(
                    'Payment Formspree Error:',
                    response.status,
                    data
                );


                paymentStatus.textContent =
                    errorMessage;

                paymentStatus.classList.add('error');
            }


        } catch (error) {

            console.error(
                'Payment confirmation error:',
                error
            );


            paymentStatus.textContent =
                'Unable to connect to the payment confirmation service. Please check your internet connection and try again.';

            paymentStatus.classList.add('error');

        } finally {

            paymentSubmit.disabled = false;

            paymentSubmit.classList.remove('loading');


            if (buttonText) {
                buttonText.hidden = false;
            }

            if (buttonLoading) {
                buttonLoading.hidden = true;
            }
        }

    });
}


/* =========================================
   NEW PAYMENT CONFIRMATION
========================================= */

if (
    newPaymentConfirmation &&
    paymentSuccess &&
    paymentForm &&
    paymentStatus
) {

    newPaymentConfirmation.addEventListener('click', () => {

        paymentSuccess.hidden = true;

        paymentForm.hidden = false;

        paymentForm.reset();

        paymentStatus.textContent = '';
        paymentStatus.className = 'form-status';


        paymentForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}


/* =========================================
   PAYMENT METHOD SELECT
========================================= */

const paymentMethod =
    document.querySelector('#paymentMethod');

if (paymentMethod) {

    paymentMethod.addEventListener('change', () => {

        paymentMethod.classList.toggle(
            'selected',
            paymentMethod.value !== ''
        );
    });
}


/* =========================================
   CURRENT YEAR
========================================= */

const yearElements =
    document.querySelectorAll('[data-current-year]');

yearElements.forEach(element => {

    element.textContent =
        new Date().getFullYear();

});
