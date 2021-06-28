const transformTextUrl = () => {
    const formatUrlClass = 'format-url';
    const texts = document.getElementsByClassName(formatUrlClass);

    for (let i = 0; i < texts.length; i++) {
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
