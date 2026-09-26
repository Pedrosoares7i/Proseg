(function () {
    'use strict';

    function initTabs() {
        var tablist = document.querySelector('[data-tabs]');
        if (!tablist) return;

        var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
        if (!tabs.length) return;

        function select(tab, focus) {
            tabs.forEach(function (item) {
                var selected = item === tab;
                item.setAttribute('aria-selected', String(selected));
                item.tabIndex = selected ? 0 : -1;

                var panel = document.getElementById(item.getAttribute('aria-controls'));
                if (!panel) return;
                panel.hidden = !selected;
                if (selected) {
                    panel.classList.add('is-revealed');
                } else {
                    panel.classList.remove('is-revealed');
                }
            });
            if (focus) tab.focus();
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () {
                select(tab, false);
            });

            tab.addEventListener('keydown', function (event) {
                var next = null;

                if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
                else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
                else if (event.key === 'Home') next = tabs[0];
                else if (event.key === 'End') next = tabs[tabs.length - 1];
                else return;

                event.preventDefault();
                select(next, true);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTabs);
    } else {
        initTabs();
    }
})();
