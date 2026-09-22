const STORAGE_KEY = 'recipe-app:favorites';

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeFavorites(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function initFavoriteToggle(button: HTMLButtonElement) {
  const slug = button.dataset.slug;
  const labelAdd = button.dataset.labelAdd ?? 'add to favorites';
  const labelRemove = button.dataset.labelRemove ?? 'remove from favorites';
  if (!slug) return;

  const sync = () => {
    const active = readFavorites().has(slug);
    button.textContent = active ? '♥' : '♡';
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? labelRemove : labelAdd);
  };

  button.addEventListener('click', () => {
    const favorites = readFavorites();
    if (favorites.has(slug)) favorites.delete(slug);
    else favorites.add(slug);
    writeFavorites(favorites);
    sync();
  });

  sync();
}

document.querySelectorAll<HTMLButtonElement>('.fav-btn').forEach(initFavoriteToggle);
