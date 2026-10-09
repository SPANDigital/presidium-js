import React from 'react';
import { init as initModal } from './components/image/modal';
import { loadTooltips } from './components/tooltips/tooltips';
import { mountContainerListeners } from './util/articles';
// import {handleQueryString, checkSessionStorageConfig} from './util/config';
import { Subject } from 'rxjs/Subject';
import $ from 'jquery';
import scrollSpy from './util/scroll-spy';

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
        if (!($(article).data('roles').includes(selectedRole))) {
          $(article).hide();
        }
      });

      $navSectionLinks.each((i, link) => {
        if (!($(link).data('roles').includes(selectedRole))) {
          $(link).hide()
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

// Find the closest visible .article-title element to the top of the viewport
// and use its position as the dynamic offset for scroll spy detection
const measureArticleTitleOffset = () => {
  let closest = null;
  let minDistance = Infinity;

  const titles = document.querySelectorAll('.article-title');
  for (let i = 0; i < titles.length; i++) {
    const top = titles[i].getBoundingClientRect().top;
    if (top >= 0 && top < minDistance) {
      minDistance = top;
      closest = titles[i];
    }
  }

  return closest ? minDistance : 50;
};

// Gumshoe resolves `offset` once per nav item within a single detect pass, so measuring every
// title inside the callback costs O(nav items x titles) getBoundingClientRect calls per scroll
// - ~2M of them on large module pages, which is seconds of forced layout per frame. The value
// is identical for every nav item in a pass, so measure once and share it across the pass.
let cachedOffset = null;
let cachedOffsetScrollY = null;

const getArticleTitleOffset = () => {
  // Keyed on scrollY so a pass never reuses a value measured at a different scroll position,
  // and cleared on the next frame so layout shifts at an unchanged scroll position (lazily
  // mounted article bars, late-loading images) are still picked up.
  if (cachedOffset !== null && cachedOffsetScrollY === window.scrollY) {
    return cachedOffset;
  }

  cachedOffset = measureArticleTitleOffset();
  cachedOffsetScrollY = window.scrollY;

  window.requestAnimationFrame(() => {
    cachedOffset = null;
    cachedOffsetScrollY = null;
  });

  return cachedOffset;
};

var spy = new scrollSpy('.navbar-items ul a', {
  attribute: 'data-target',
  offset: getArticleTitleOffset,
  navClass: 'active',
  nested: true,
  nestedClass: 'active', // applied to the parent items
  reflow: true,
});
