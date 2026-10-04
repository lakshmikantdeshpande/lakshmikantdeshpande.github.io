import { cleanLink } from "./clean-link.js";
const form = document.querySelector("#cleaner-form");
if (form) {
  form.hidden = false;
  const input = document.querySelector("#url-input");
  const output = document.querySelector("#url-output");
  const result = form.querySelector(".clean-result");
  const status = document.querySelector("#cleaner-status");
  const copy = document.querySelector("#copy-link");
  let resultVersion = 0;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    resultVersion++;
    copy.textContent = "Copy";
    try {
      const cleaned = cleanLink(input.value);
      input.removeAttribute("aria-invalid");
      output.value = cleaned.url;
      result.hidden = false;
      status.textContent = cleaned.removed
        ? `${cleaned.removed} tracking parameter${cleaned.removed === 1 ? "" : "s"} removed. A little lighter.`
        : "No recognised tracking parameters. This link is already tidy.";
    } catch (error) {
      input.setAttribute("aria-invalid", "true");
      status.textContent = error.message;
      result.hidden = true;
      output.value = "";
    }
  });
  input.addEventListener("input", () => {
    resultVersion++;
    result.hidden = true;
    output.value = "";
    status.textContent = "";
    input.removeAttribute("aria-invalid");
    copy.textContent = "Copy";
  });
  copy.addEventListener("click", async () => {
    const version = resultVersion;
    try {
      await navigator.clipboard.writeText(output.value);
      if (version !== resultVersion) return;
      copy.textContent = "Copied";
      status.textContent = "Clean link copied. Ready to share.";
    } catch {
      if (version !== resultVersion) return;
      output.focus();
      output.select();
      status.textContent =
        "Copy isn’t available here. The link is selected so you can copy it yourself.";
    }
  });
}
