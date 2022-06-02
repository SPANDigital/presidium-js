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
$(document).ready(function () {
  const filterArticles = (selectedRole) => {
    sessionStorage.setItem('role', selectedRole);
    $('.article').show();
    $('#presidium-navigation .menu-row').removeClass('hidden').show();
    if (selectedRole != 'All Roles') {
      const $articles = $(`.article:not([data-roles="All Roles"],[data-roles="${selectedRole}"])`);
      $articles.each((i, article) => {
        // Edge case: When an article has multiple roles assigned to it check if the current filter
        // is not contained therein before hiding the article.
        if (!( $(article).data('roles').includes(selectedRole) )){
          $(article).hide();
          $(`#presidium-navigation .menu-row>a[data-target="#${article.id}"]`)
          .parent()
          .addClass('hidden')
          .hide();
        }
      });

      $('#presidium-navigation .menu-row').each((_, e) => {
        const $row = $(e);
        const $children = $row.find('ul>li.menu-row');
        const $active = $children.filter(':not(.hidden)');
        if ($active.length == 0 && $children.length > 0) {
          $row.hide();
        }
      });
    }
  };

  $('#roles-select').on('change', function (e) {
    const optionSelected = $('option:selected', this);
    const selectedRole = this.value;
    filterArticles(selectedRole);
  });
});

let offset = 0;
const content = $('.article-title').get(0);
if (content) {
  offset = window.pageYOffset + content.getBoundingClientRect().top;
}

var spy = new scrollSpy('.navbar-items ul a', {
  attribute: 'data-target',
  offset: offset,
  navClass: 'active',
  nested: true,
  nestedClass: 'active', // applied to the parent items
  reflow: true,
});
