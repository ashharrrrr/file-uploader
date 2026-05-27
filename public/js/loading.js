function setButtonLoading(button, loadingText = "Loading...") {
  if (!button) return;

  button.dataset.originalText = button.innerHTML;

  button.disabled = true;

  button.classList.add(
    "opacity-70",
    "cursor-not-allowed",
    "flex",
    "items-center",
    "justify-center",
  );

  button.innerHTML = `
    <span
      class="
        flex
        items-center
        gap-2
      "
    >
      <svg
        class="
          animate-spin
          h-4
          w-4
        "
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>

        <path
          class="opacity-75"
          fill="currentColor"
          d="
            M4 12a8 8 0 018-8v4
            a4 4 0 00-4 4H4z
          "
        ></path>
      </svg>

      ${loadingText}
    </span>
  `;
}

function resetButtonLoading(button) {
  if (!button) return;

  button.disabled = false;

  button.classList.remove(
    "opacity-70",
    "cursor-not-allowed",
    "flex",
    "items-center",
    "justify-center",
  );

  button.innerHTML = button.dataset.originalText;
}

window.setButtonLoading = setButtonLoading;

window.resetButtonLoading = resetButtonLoading;
