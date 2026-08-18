(function ($) {
  'use strict';

  function isSafeImageSource(source) {
    if (typeof source !== 'string') {
      return false;
    }

    var value = source.trim();
    if (!value) {
      return false;
    }

    return /^https?:\/\//i.test(value) ||
      /^\/(?!\/)/.test(value) ||
      /^\.\//.test(value) ||
      /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/.test(value);
  }

  function renderTutorCards(tutors) {
    var slot = document.getElementById('tutor-cards-slot');
    var template = document.getElementById('tutor-card-template');
    if (!slot || !template) {
      return;
    }

    slot.innerHTML = '';

    if (!Array.isArray(tutors) || tutors.length === 0) {
      slot.innerHTML = '<p class="col-xs-12 tutor-loading-message">Tutor profiles are not available right now.</p>';
      return;
    }

    tutors.forEach(function (tutor) {
      var card = document.importNode(template.content, true);
      var photo = card.querySelector('.tutor-card-photo');
      var name = card.querySelector('.tutor-card-name');
      var availability = card.querySelector('.tutor-card-availability');
      var courses = card.querySelector('.tutor-card-courses');

      if (photo && tutor.photo && isSafeImageSource(tutor.photo.src)) {
        photo.src = tutor.photo.src;
        photo.style.display = '';
        photo.alt = (typeof tutor.photo.alt === 'string' && tutor.photo.alt) ||
          (typeof tutor.name === 'string' ? tutor.name : '');
      } else if (photo) {
        photo.removeAttribute('src');
        photo.style.display = 'none';
        photo.alt = '';
      }
      if (name && typeof tutor.name === 'string') {
        name.textContent = tutor.name;
      }
      if (availability) {
        availability.textContent = Array.isArray(tutor.availability) ? tutor.availability.join(', ') : '';
      }
      if (courses) {
        courses.textContent = Array.isArray(tutor.courses) ? tutor.courses.join(', ') : '';
      }

      slot.appendChild(card);
    });
  }

  if (!$) {
    return;
  }

  $(function () {
    $.getJSON('data/tutors.json').done(function (tutorsResponse) {
      renderTutorCards(tutorsResponse);
    }).fail(function () {
      var slot = document.getElementById('tutor-cards-slot');
      if (slot) {
        slot.innerHTML = '<p class="col-xs-12 tutor-loading-message">Unable to load tutoring data right now.</p>';
      }
    });
  });
}(window.jQuery));
