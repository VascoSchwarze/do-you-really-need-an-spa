import { actions } from 'astro:actions';

function initRatingForm(form: HTMLFormElement) {
  const result = form.querySelector<HTMLParagraphElement>('[data-rating-result]');
  const labelThanks = form.dataset.labelThanks ?? 'Thanks! Current average:';
  const labelError = form.dataset.labelError ?? 'Could not save your rating.';
  const labelUnit = form.dataset.labelUnit ?? 'ratings';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { data, error } = await actions.rateRecipe(new FormData(form));
    if (!result) return;
    result.hidden = false;
    if (error) {
      result.textContent = labelError;
      return;
    }
    result.textContent = `${labelThanks} ${data.average.toFixed(1)} ★ (${data.count} ${labelUnit})`;
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-rating-form]').forEach(initRatingForm);
