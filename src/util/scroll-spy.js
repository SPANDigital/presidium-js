const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting)
        console.log('new active slug', `#${entry.target.getAttribute('id')}`);
    }),
  {
    root: null, // Null = based on viewport
    rootMargin: '0px', // Margin for root if desired
    threshold: 0.2, // Percentage of visibility needed to execute function
  }
);

[...document.querySelectorAll('.article')].forEach((article) => observer.observe(article));
