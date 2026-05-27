document
  .querySelectorAll("form")
  .forEach(form => {

    form.addEventListener(
      "submit",
      () => {

        const button =
          form.querySelector(
            "button[type='submit']"
          );

        setButtonLoading(
          button,
          "Please wait..."
        );
    });
});