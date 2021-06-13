const formatDate = (() => {
    const formatDateClass = 'formatDate';
    const dates = document.getElementsByClassName(formatDateClass);
    const timezoneIdentifier = 'GMT';

    for (var i = 0; i < dates.length; i++) {
        const data = dates[i].firstChild;
        const gmtIndex = data.textContent.lastIndexOf(timezoneIdentifier);
        
        data.nodeValue = data.textContent.substring(4, gmtIndex);
    }
})()
