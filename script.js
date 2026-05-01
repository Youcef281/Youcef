const cardsContainer = document.querySelector('.work-cards-container')

const scrollLeftBtn = document.getElementById('scrollLeftBtn')
const scrollRightBtn = document.getElementById('scrollRightBtn')

let currentWorkCard = cardsContainer.firstElementChild;

function updateMask() {
    const isAtStart = scrollLeftBtn.classList.contains('disabled');
    const isAtEnd = scrollRightBtn.classList.contains('disabled');
    
    let maskImage;
    
    if (isAtStart && isAtEnd) {
        maskImage = 'none';
    } else if (isAtStart) {
        maskImage = 'linear-gradient(to right, black calc(100% - 15px), transparent)';
    } else if (isAtEnd) {
        maskImage = 'linear-gradient(to right, transparent, black 15px)';
    } else {
        maskImage = 'linear-gradient(to right, transparent, black 15px, black calc(100% - 15px), transparent)';
    }
    
    cardsContainer.style.maskImage = maskImage;
    cardsContainer.style.webkitMaskImage = maskImage;
}

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
        if(entry.isIntersecting) {
            if (entry.target == cardsContainer.firstElementChild) {
                scrollLeftBtn.classList.add('disabled')
            } else {
                scrollRightBtn.classList.add('disabled')
            }
        }
        else {
            if (entry.target == cardsContainer.firstElementChild) {
                scrollLeftBtn.classList.remove('disabled')
            } else {
                scrollRightBtn.classList.remove('disabled')
            }
        }
    });
    
    updateMask();
}, { threshold: 0.9, root: cardsContainer });

observer.observe(cardsContainer.firstElementChild)
observer.observe(cardsContainer.lastElementChild)

// Scroll LEFT (to previous card)
scrollLeftBtn.addEventListener("click", () => {
    if(!currentWorkCard.previousElementSibling) return;
    
    currentWorkCard = currentWorkCard.previousElementSibling;
    
    const containerWidth = cardsContainer.offsetWidth;
    const cardLeft = currentWorkCard.offsetLeft;
    const cardWidth = currentWorkCard.offsetWidth;

    const scrollPos = cardLeft - (containerWidth / 2) + (cardWidth / 2);
    cardsContainer.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
    });
})

// Scroll RIGHT (to next card)
scrollRightBtn.addEventListener("click", () => {
    if(!currentWorkCard.nextElementSibling) return;
    
    currentWorkCard = currentWorkCard.nextElementSibling;
    
    const containerWidth = cardsContainer.offsetWidth;
    const cardLeft = currentWorkCard.offsetLeft;
    const cardWidth = currentWorkCard.offsetWidth;

    const scrollPos = cardLeft - (containerWidth / 2) + (cardWidth / 2);
    cardsContainer.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
    });
})