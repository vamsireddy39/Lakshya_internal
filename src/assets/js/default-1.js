document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownButton.addEventListener('click', function () {
        dropdownContent.classList.toggle('show');
    });

    dropdownContent.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            dropdownButton.textContent = event.target.textContent;
            dropdownContent.classList.remove('show');
            console.log('Selected value:', event.target.getAttribute('data-value'));
        }
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (event) {
        if (!event.target.matches('.dropdown-button')) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });
});