(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mobileQuery = window.matchMedia('(max-width: 960px)');

    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function throttleRaf(callback) {
        var ticking = false;

        return function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                callback();
                ticking = false;
            });
        };
    }

    function initHeader() {
        var header = document.querySelector('[data-header]');
        if (!header) return;

        var update = throttleRaf(function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        });

        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    function initNav() {
        var header = document.querySelector('[data-header]');
        var toggle = document.querySelector('[data-nav-toggle]');
        var label = document.querySelector('[data-nav-toggle-label]');
        var nav = document.getElementById('siteNav');
        if (!header || !toggle || !nav) return;

        function isOpen() {
            return toggle.getAttribute('aria-expanded') === 'true';
        }

        function setOpen(open) {
            toggle.setAttribute('aria-expanded', String(open));
            header.classList.toggle('is-open', open);
            if (label) label.textContent = open ? 'Fechar' : 'Menu';
        }

        function close(returnFocus) {
            if (!isOpen()) return;
            setOpen(false);
            if (returnFocus) toggle.focus();
        }

        toggle.addEventListener('click', function () {
            if (isOpen()) {
                close(false);
                return;
            }
            setOpen(true);
            var firstLink = nav.querySelector('.nav__link');
            if (firstLink) firstLink.focus();
        });

        nav.addEventListener('click', function (event) {
            if (event.target.closest('.nav__link')) close(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') close(true);
        });

        document.addEventListener('click', function (event) {
            if (isOpen() && !header.contains(event.target)) close(false);
        });

        var sync = function () {
            if (!mobileQuery.matches) close(false);
        };
        mobileQuery.addEventListener ? mobileQuery.addEventListener('change', sync) : mobileQuery.addListener(sync);
    }

    function initScrollSpy() {
        var nav = document.getElementById('siteNav');
        if (!nav) return;

        var links = Array.prototype.slice.call(nav.querySelectorAll('.nav__link[href^="#"]'));
        var pairs = links
            .map(function (link) {
                var section = document.getElementById(link.getAttribute('href').slice(1));
                return section ? { link: link, section: section } : null;
            })
            .filter(Boolean);

        if (!pairs.length) return;

        var headerHeight = function () {
            var header = document.querySelector('[data-header]');
            return header ? header.offsetHeight : 72;
        };

        var update = throttleRaf(function () {
            var threshold = headerHeight() + 32;
            var current = null;

            pairs.forEach(function (pair) {
                if (pair.section.getBoundingClientRect().top <= threshold) current = pair;
            });

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
                current = pairs[pairs.length - 1];
            }

            pairs.forEach(function (pair) {
                if (pair === current) {
                    pair.link.setAttribute('aria-current', 'true');
                } else {
                    pair.link.removeAttribute('aria-current');
                }
            });
        });

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', throttleRaf(update), { passive: true });
    }

    function initReveal() {
        var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
        if (!items.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            items.forEach(function (item) {
                item.classList.add('is-visible');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
        );

        items.forEach(function (item) {
            observer.observe(item);
        });
    }

    function initCounters() {
        var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count-to]'));
        if (!counters.length) return;

        function format(value) {
            return String(value);
        }

        function animate(element) {
            var target = parseInt(element.getAttribute('data-count-to'), 10);
            if (isNaN(target)) return;

            if (prefersReducedMotion) {
                element.textContent = format(target);
                return;
            }

            var duration = 1100;
            var start = null;

            function frame(timestamp) {
                if (start === null) start = timestamp;
                var progress = Math.min((timestamp - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                element.textContent = format(Math.round(target * eased));
                if (progress < 1) window.requestAnimationFrame(frame);
            }

            element.textContent = '0';
            window.requestAnimationFrame(frame);
        }

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animate);
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    animate(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(function (element) {
            observer.observe(element);
        });
    }

    function initAccordion() {
        var triggers = Array.prototype.slice.call(document.querySelectorAll('.accordion__trigger'));
        if (!triggers.length) return;

        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                var expanded = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', String(!expanded));
            });
        });
    }

    function initYear() {
        var element = document.querySelector('[data-year]');
        if (element) element.textContent = String(new Date().getFullYear());
    }

    onReady(function () {
        initHeader();
        initNav();
        initScrollSpy();
        initReveal();
        initCounters();
        initAccordion();
        initYear();
    });
})();
