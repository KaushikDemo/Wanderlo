document.addEventListener('DOMContentLoaded', function() {
    const bookNowBtn = document.querySelector('.cta-button');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'second page final.html';
        });
    }

    const calculatePlanBtn = document.getElementById('calculate-btn');
    if (calculatePlanBtn) {
        calculatePlanBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setTimeout(() => {
                window.location.href = 'page 3.html';
            }, 800);
        });
    }

    const selectDestinationBtns = document.querySelectorAll('.select-btn');
    const nextActivitiesBtn = document.querySelector('.nav-buttons .primary');

    if (selectDestinationBtns.length > 0) {
        selectDestinationBtns.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                setTimeout(() => {
                    window.location.href = 'page 4 finall.html';
                }, 500);
            });
        });
    }
    
    if (nextActivitiesBtn && nextActivitiesBtn.textContent.includes('Next: Activities')) {
        nextActivitiesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'page 4 finall.html';
        });
    }

    const nextConfirmationBtn = document.getElementById('next-btn');
    if (nextConfirmationBtn) {
        nextConfirmationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isGuideSelected = document.querySelector('.guide-option.selected');
            const isHometown = document.getElementById('no-guide-container').style.display === 'block';

            if (isGuideSelected || isHometown) {
                setTimeout(() => {
                    window.location.href = 'final image.html';
                }, 800);
            }
        });
    }
});