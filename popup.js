document.addEventListener('DOMContentLoaded', function() {
    const titleInput = document.getElementById('bookmarkTitle');
    const urlInput = document.getElementById('bookmarkUrl');
    const addButton = document.getElementById('addBookmarkBtn');
    const currentPageButton = document.getElementById('addCurrentPage');
    const messageDiv = document.getElementById('message');

    // Auto-fill current page info
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        titleInput.value = currentTab.title;
        urlInput.value = currentTab.url;
    });

    // Add bookmark with custom URL
    addButton.addEventListener('click', function() {
        const title = titleInput.value || 'Unnamed Bookmark';
        const url = urlInput.value || 'https://example.com';
        
        chrome.bookmarks.create({
            title: title,
            url: url,
            parentId: '1' // Bookmarks Bar
        }, function(newBookmark) {
            if (chrome.runtime.lastError) {
                showMessage('Error: ' + chrome.runtime.lastError.message, 'error');
            } else {
                showMessage(`✅ Bookmark "${title}" added successfully!`, 'success');
                // Clear inputs after success
                setTimeout(() => {
                    titleInput.value = '';
                    urlInput.value = '';
                }, 2000);
            }
        });
    });

    // Bookmark current page
    currentPageButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            const title = currentTab.title;
            const url = currentTab.url;
            
            chrome.bookmarks.create({
                title: title,
                url: url,
                parentId: '1' // Bookmarks Bar
            }, function(newBookmark) {
                if (chrome.runtime.lastError) {
                    showMessage('Error: ' + chrome.runtime.lastError.message, 'error');
                } else {
                    showMessage(`✅ "${title}" bookmarked!`, 'success');
                }
            });
        });
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 3000);
    }
});
