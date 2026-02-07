// booking.js - Booking form validation and micro-interactions

document.addEventListener('DOMContentLoaded', function () {
    // Quote form functionality
    const quoteBtn = document.querySelector('.quote-btn');
    const quoteResult = document.querySelector('.quote-result');
    const quoteForm = document.querySelector('.quote-form');

    quoteBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const pickup = document.getElementById('quote-pickup').value.trim();
        const delivery = document.getElementById('quote-delivery').value.trim();
        const itemType = document.getElementById('quote-item-type').value;
        const weight = document.getElementById('quote-weight').value.trim();

        // Validation
        if (!pickup || !delivery || !itemType || !weight) {
            alert('Please fill in all fields');
            return;
        }

        // Calculate quote based on simple pricing
        const basePrice = 2000; // ₦2,000 base
        const weightMultiplier = parseFloat(weight) || 1;
        const typeMultiplier = itemType === 'fragile' ? 1.5 : 1;
        
        const estimatedPrice = basePrice * typeMultiplier + (weightMultiplier * 500);

        // Display result
        const resultSpan = quoteResult.querySelector('span');
        resultSpan.textContent = '₦' + estimatedPrice.toLocaleString('en-NG');
        quoteResult.style.display = 'block';
        quoteResult.classList.add('show');
    });

    // Booking form validation and feedback
    const form = document.getElementById('bookingForm');
    const formMessage = document.getElementById('formMessage');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;
        formMessage.textContent = '';
        // Validate all required fields
        form.querySelectorAll('input, select').forEach(function (input) {
            if (input.required && !input.value) {
                valid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });
        // Custom pattern validation
        const phone = form.phone;
        if (phone && phone.value && !/^([0-9\-\+\s\(\)]{7,})$/.test(phone.value)) {
            valid = false;
            phone.classList.add('invalid');
        }
        const weight = form.weight;
        if (weight && weight.value && !/^([0-9]+(\.[0-9]{1,2})?\s?(kg|g|lb|oz)?)$/.test(weight.value)) {
            valid = false;
            weight.classList.add('invalid');
        }
        if (!valid) {
            formMessage.textContent = 'Please fill all required fields correctly.';
            formMessage.style.color = '#ff4d4f';
            formMessage.classList.add('shake');
            setTimeout(() => formMessage.classList.remove('shake'), 400);
            return;
        }
        // Simulate successful booking
        formMessage.textContent = 'Booking submitted! We will contact you soon.';
        formMessage.style.color = '#0b6efd';
        form.reset();
        // Remove floating labels
        setTimeout(() => {
            formMessage.textContent = '';
        }, 4000);
    });

    // Floating label for select
    document.querySelectorAll('select').forEach(function (select) {
        select.addEventListener('change', function () {
            if (select.value) {
                select.classList.add('selected');
            } else {
                select.classList.remove('selected');
            }
        });
    });
});
