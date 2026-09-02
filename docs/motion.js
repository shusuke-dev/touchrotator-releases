/**
 * The page's movement. All of it is decoration: without this file the page
 * is complete, which is why the animated-in state is the default and the
 * `js` class below is what hides things in the first place.
 */
document.documentElement.classList.add("js");

const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const parts = document.querySelectorAll(".reveal");

if (still || !("IntersectionObserver" in window)) {
  parts.forEach((part) => part.classList.add("in"));
} else {
  // Slightly inside the bottom edge, so a block starts moving as it comes
  // up rather than after it has already arrived.
  const watcher = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Intersecting, or already scrolled past: a fast flick can carry a
        // block from below the fold to above it between two frames, and a
        // block that is never told to appear would stay invisible.
        const seen =
          entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight;
        if (!seen) return;
        entry.target.classList.add("in");
        watcher.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );
  parts.forEach((part) => watcher.observe(part));
}

// The header carries no line until the page has moved under it.
const bar = document.querySelector(".top");
if (bar) {
  const mark = () => bar.classList.toggle("scrolled", window.scrollY > 8);
  mark();
  addEventListener("scroll", mark, { passive: true });
}
