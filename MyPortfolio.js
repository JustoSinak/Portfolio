let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop = 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);
};

// PDF Download Functionality
function downloadPortfolioAsPDF() {
    // Try advanced PDF generation first, fallback to print
    if (typeof html2pdf !== 'undefined') {
        downloadPortfolioAsPDFAdvanced();
    } else {
        downloadPortfolioAsPDFBasic();
    }
}

// Basic PDF download using browser print
function downloadPortfolioAsPDFBasic() {
    // Hide elements that shouldn't appear in PDF
    const elementsToHide = document.querySelectorAll('.pdf-hide');
    elementsToHide.forEach(el => el.style.display = 'none');

    // Add PDF-specific styling
    document.body.classList.add('pdf-mode');

    // Show user instruction
    alert('Please select "Save as PDF" in the print dialog and set margins to "Minimum" for best results.');

    // Trigger browser print dialog
    window.print();

    // Restore original styling after print dialog
    setTimeout(() => {
        elementsToHide.forEach(el => el.style.display = '');
        document.body.classList.remove('pdf-mode');
    }, 1000);
}

// Advanced PDF download using html2pdf library
function downloadPortfolioAsPDFAdvanced() {
    // Show loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: var(--bg-color); color: var(--main-color); padding: 2rem;
                    border-radius: 1rem; border: 2px solid var(--main-color); z-index: 9999;
                    font-size: 1.6rem; text-align: center;">
            <i class="bx bx-loader-alt" style="animation: spin 1s linear infinite; font-size: 2rem; display: block; margin-bottom: 1rem;"></i>
            Generating PDF... Please wait
        </div>
    `;
    document.body.appendChild(loadingMsg);

    // Hide elements that shouldn't appear in PDF
    const elementsToHide = document.querySelectorAll('.pdf-hide');
    elementsToHide.forEach(el => el.style.display = 'none');

    document.body.classList.add('pdf-mode');

    const element = document.body;
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'Sinak_Justo_Portfolio.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
            scale: 1.5,
            useCORS: true,
            letterRendering: true,
            allowTaint: false,
            backgroundColor: '#ffffff'
        },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        // Restore original styling
        elementsToHide.forEach(el => el.style.display = '');
        document.body.classList.remove('pdf-mode');
        document.body.removeChild(loadingMsg);
    }).catch((error) => {
        console.error('PDF generation failed:', error);
        // Fallback to basic print
        document.body.removeChild(loadingMsg);
        elementsToHide.forEach(el => el.style.display = '');
        document.body.classList.remove('pdf-mode');
        downloadPortfolioAsPDFBasic();
    });
}

// Add CSS animation for loading spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Language Toggle Functionality
let currentLanguage = 'en';

function initializeLanguageToggle() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            if (selectedLang !== currentLanguage) {
                switchLanguage(selectedLang);
                updateActiveLanguageButton(selectedLang);
            }
        });
    });
}

function switchLanguage(lang) {
    currentLanguage = lang;

    // Get all elements with translation data
    const translatableElements = document.querySelectorAll('[data-en][data-fr]');

    translatableElements.forEach(element => {
        const translation = element.getAttribute(`data-${lang}`);
        if (translation) {
            // Handle different element types
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                // For regular text content, preserve HTML structure
                if (element.innerHTML.includes('<span>')) {
                    // Handle headings with spans
                    const spanContent = element.querySelector('span');
                    if (spanContent) {
                        const spanText = spanContent.textContent;
                        element.innerHTML = translation.replace(spanText, `<span>${spanText}</span>`);
                    } else {
                        element.innerHTML = translation;
                    }
                } else {
                    element.textContent = translation;
                }
            }
        }
    });

    // Update download button text
    updateDownloadButtonText(lang);

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
}

function updateActiveLanguageButton(lang) {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

function updateDownloadButtonText(lang) {
    const downloadButtons = document.querySelectorAll('.pdf-download-btn span, .pdf-download-main-btn span');
    const downloadText = lang === 'fr' ? 'Télécharger PDF' : 'Download PDF';
    const completeDownloadText = lang === 'fr' ? 'Télécharger le Portfolio Complet en PDF' : 'Download Complete Portfolio as PDF';

    downloadButtons.forEach(btn => {
        if (btn.textContent.includes('Complete') || btn.textContent.includes('Complet')) {
            btn.textContent = completeDownloadText;
        } else {
            btn.textContent = downloadText;
        }
    });
}

function loadSavedLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'en') {
        switchLanguage(savedLang);
        updateActiveLanguageButton(savedLang);
    }
}

// Initialize language toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguageToggle();
    loadSavedLanguage();
});