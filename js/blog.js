// ============================================
// BLOG JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initCodeCopy();
    initShareButtons();
    initTableOfContents();
});

// ============================================
// READING PROGRESS BAR
// ============================================

function initReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ============================================
// CODE COPY FUNCTIONALITY
// ============================================

function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy code';
        
        // Add button to pre element
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
        
        // Copy functionality
        copyButton.addEventListener('click', async () => {
            const code = codeBlock.textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.style.color = 'var(--color-success)';
                
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

// ============================================
// SHARE BUTTONS
// ============================================

function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const url = window.location.href;
            const title = document.querySelector('.blog-title-main')?.textContent || 'Check out this article';
            
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('fa-twitter')) {
                const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                window.open(twitterUrl, '_blank', 'width=550,height=420');
            } else if (icon.classList.contains('fa-linkedin')) {
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                window.open(linkedinUrl, '_blank', 'width=550,height=420');
            } else if (icon.classList.contains('fa-link')) {
                copyToClipboard(url);
                showCopyNotification(btn);
            }
        });
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function showCopyNotification(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = 'var(--color-success)';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 2000);
}

// ============================================
// TABLE OF CONTENTS (Optional Enhancement)
// ============================================

function initTableOfContents() {
    const headings = document.querySelectorAll('.blog-content h2, .blog-content h3');
    if (headings.length === 0) return;
    
    // Add IDs to headings for anchor links
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
    });
}

// ============================================
// ESTIMATED READ TIME CALCULATOR
// ============================================

function calculateReadTime() {
    const article = document.querySelector('.blog-content');
    if (!article) return;
    
    const text = article.textContent;
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    
    const readTimeElement = document.querySelector('.blog-read-time');
    if (readTimeElement) {
        readTimeElement.textContent = `${readTime} min read`;
    }
}
