const CLASSES = {
  requiredField: 'required',
  invalidField: 'is-invalid',
  disabledButton: 'disabled'
}

const IDENTIFIERS = {
  submitButton: 'submit'
}

const addInputListener = (() => {
  const fields =  document.getElementsByClassName(CLASSES.requiredField);
  const eventName = 'blur';

  for (var i = 0; i < fields.length; i++) {
    const input = fields[i];

    input.addEventListener(eventName, (ev) => validateInput(input, ev.target.value));
  }
})();

const validateInput = (field, value) => {
  if (!value) {
    addRequireError(field);
  } else {
    removeRequireError(field);
  }
};

const addRequireError = field => {
  field.classList.add(CLASSES.invalidField);
  disableSubmit();
}

const removeRequireError = field => {
 field.classList.remove(CLASSES.invalidField);
 verifyEnableButton();
}

const verifyEnableButton = () => {
  const invalidFields = document.getElementsByClassName(CLASSES.invalidField);

  if (!invalidFields.length) {
    enableSubmit();
  }
}

const disableSubmit = () => {
  const submitButton = document.getElementById(IDENTIFIERS.submitButton);

  submitButton.classList.add(CLASSES.disabledButton);
}

const enableSubmit = () => {
  const submitButton = document.getElementById(IDENTIFIERS.submitButton);

  submitButton.classList.remove(CLASSES.disabledButton);
}
