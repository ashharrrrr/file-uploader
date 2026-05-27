function showToast(
  message,
  type = "error"
) {

  console.log(flashData?.dataset.errors);

  const toast =
    document.createElement("div");

  toast.className =
    `
      fixed
      top-6
      right-6
      z-[9999]
      px-4
      py-3
      rounded-xl
      shadow-lg
      text-sm
      font-medium
      text-white
      transition-all
      duration-300
      ${type === "error"
        ? "bg-red-500"
        : "bg-green-500"}
    `;

  toast.innerText =
    message;

  document.body.appendChild(
    toast
  );

  setTimeout(() => {

    toast.style.opacity =
      "0";

    setTimeout(() => {
      toast.remove();
    }, 300);

  }, 3000);
}

window.showToast =
  showToast;


const flashData =
  document.getElementById(
    "flash-data"
  );

if (flashData) {
  const errors =
    JSON.parse(
      flashData.dataset.errors
    );

  const success =
    JSON.parse(
      flashData.dataset.success
    );

  errors.forEach(error => {
    showToast(error);
  });

  success.forEach(msg => {
    showToast(msg, "success");
  });
}