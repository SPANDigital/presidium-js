import React from 'react';
import { init as initModal } from './components/image/modal';
import { loadTooltips } from './components/tooltips/tooltips';
import { Subject } from 'rxjs/Subject';
import $ from 'jquery';
import './util/scroll-spy';
import { elementScrollIntoViewPolyfill } from 'seamless-scroll-polyfill';

elementScrollIntoViewPolyfill();
initModal();
// TODO: Find a solution that is easier on the local storage if needed for edit mode.
//       Safari returns and error with 303 when local storage exceeds the limit for the domain
//       https://macreports.com/safari-kcferrordomaincfnetwork-error-blank-page-fix/
//       https://www.quora.com/Why-does-Safari-give-me-a-kCFErrorDomainCFNetwork-error-303-when-browsing-some-sites
// handleQueryString(); //Check query string arguments and persist to sessionStorage
// checkSessionStorageConfig(); //Check sessionStorage for known configurations and apply them

var presidium = {
  tooltips: {
    load: loadTooltips,
  },
  modal: {
    init: initModal,
  },
  versions: {},
};

window.presidium = presidium;
window.events = new Subject();

// Role filtering
$(function () {
  const cachedRole = sessionStorage.getItem('role');
  const filterArticles = (selectedRole) => {
    sessionStorage.setItem('role', selectedRole);
    $('.article').show();
    $('#presidium-navigation .menu-row').removeClass('hidden').show();
    if (selectedRole != 'All Roles') {
      const $articles = $('.article:not([data-roles="All Roles"])');
      const $navSectionLinks = $('#presidium-navigation .menu-row:not([data-roles="All Roles"])');

      $articles.each((i, article) => {
        if (!$(article).data('roles').includes(selectedRole)) {
          $(article).hide();
        }
      });

      $navSectionLinks.each((i, link) => {
        if (!$(link).data('roles').includes(selectedRole)) {
          $(link).hide();
        }
      });
    }
  };

  $('#roles-select').on('change', function (e) {
    const optionSelected = $('option:selected', this);
    const selectedRole = this.value;
    filterArticles(selectedRole);
  });
  if (cachedRole && $('#roles-select option:selected').text() !== cachedRole) {
    // When a page reloads occurs from navigating to a new section
    // reload the selected role and trigger the filter
    $('#roles-select').val(cachedRole);
    $('#roles-select').trigger('change');
  }
});

let offset = 0;
const content = $('.article-title').get(0);
if (content) {
  offset = window.pageYOffset + content.getBoundingClientRect().top;
}

// New ScrollSpy
const observer = new IntersectionObserver(
  (
    entries // Calllback
  ) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentactive = document.querySelectorAll('.active');
        if (currentactive.length !== 0) {
          Array.from(currentactive).map((a) => {
            a.classList.remove('active');
          });
        }

        const slug = `#${entry.target.getAttribute('id')}`;
        const selector = `a[data-target="${slug}"]`;
        const link = document.querySelectorAll(selector)[0];
        const li = link.parentNode.parentNode;
        li.classList.add('active');
        li.classList.add('activeNavItem');

        // here we need to check what level it is and go up and open stuff?
        if (!li.parentNode.parentNode.classList.contains('menu-parent_root_1')) {
          li.parentNode.parentNode.classList.remove('closed');
          li.parentNode.parentNode.classList.add('open');

          Array.from(li.parentNode.children).forEach((subItem) => {
            subItem.style.height = 'auto';
          });
        }
        // var rect = li.getBoundingClientRect();
      }
    }), // Config
  {
    root: null, // Null = based on viewport
    rootMargin: '-50% 0px',
    threshold: 0, // Percentage of visibility needed to execute function
  }
);

Array.from(document.querySelectorAll('.article')).forEach((article) => observer.observe(article));
