const formatDate = (() => {
    const formatDateClass = 'format-date';
    const dates = document.getElementsByClassName(formatDateClass);
    const timezoneIdentifier = 'GMT';

    for (var i = 0; i < dates.length; i++) {
        const data = dates[i].firstChild;
        const gmtIndex = data.textContent.lastIndexOf(timezoneIdentifier);
        
        data.nodeValue = data.textContent.substring(4, gmtIndex);
    }
})()

const transformTextUrl = () => {
    const formatUrlClass = 'format-url';
    const texts = document.getElementsByClassName(formatUrlClass);

    for (var i = 0; i < texts.length; i++) {
        let textValue = texts[i].value;

        textValue = textValue.trim().replaceAll(' ', '-').toLowerCase();
        textValue = textValue.replace(/[áàãâä]/g, 'a');
        textValue = textValue.replace(/[éèêë]/g, 'e');
        textValue = textValue.replace(/[íìîï]/g, 'i');
        textValue = textValue.replace(/[óòõôö]/g, 'o');
        textValue = textValue.replace(/[úùûü]/g, 'u');
        textValue = textValue.replace(/[ç]/g, 'c');

        texts[i].value = textValue;
    }
}
