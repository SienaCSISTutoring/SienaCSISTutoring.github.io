(function ($) {
  'use strict';

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element && typeof value === 'string') {
      element.textContent = value;
    }
  }

  function setAttr(id, name, value) {
    var element = document.getElementById(id);
    if (element && typeof value === 'string') {
      element.setAttribute(name, value);
    }
  }

  function renderGuidelineParagraphs(paragraphs) {
    var slot = document.getElementById('guidelines-paragraphs-slot');
    if (!slot || !Array.isArray(paragraphs) || paragraphs.length === 0) {
      return;
    }

    slot.innerHTML = '';
    paragraphs.forEach(function (paragraph) {
      var p = document.createElement('p');
      p.textContent = paragraph;
      slot.appendChild(p);
    });
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

      if (photo && tutor.photo && typeof tutor.photo.src === 'string') {
        photo.src = tutor.photo.src;
      }
      if (photo && tutor.photo && typeof tutor.photo.alt === 'string') {
        photo.alt = tutor.photo.alt;
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

  function renderHomepageContent(content) {
    if (!content || typeof content !== 'object') {
      return;
    }

    if (content.hero) {
      setText('hero-main-heading', content.hero.mainHeading);
      setText('hero-department-text', content.hero.departmentText);
      if (content.hero.logo) {
        setAttr('hero-logo-image', 'src', content.hero.logo.src);
        setAttr('hero-logo-image', 'alt', content.hero.logo.alt);
      }
    }

    if (content.guidelines) {
      setText('guidelines-heading', content.guidelines.heading);
      renderGuidelineParagraphs(content.guidelines.paragraphs);
    }

    if (content.groupSchedule) {
      setText('group-schedule-heading', content.groupSchedule.heading);
      setText('group-schedule-note', content.groupSchedule.note);
    }

    if (content.studentSignIn) {
      setText('qr-sidebar-title', content.studentSignIn.title);
      setText('qr-sidebar-description', content.studentSignIn.description);
      if (content.studentSignIn.image) {
        setAttr('qr-sidebar-image', 'src', content.studentSignIn.image.src);
        setAttr('qr-sidebar-image', 'alt', content.studentSignIn.image.alt);
      }
      if (content.studentSignIn.link) {
        setText('qr-sidebar-link', content.studentSignIn.link.text);
        setAttr('qr-sidebar-link', 'href', content.studentSignIn.link.href);
      }
    }
  }

  if (!$) {
    return;
  }

  $(function () {
    $.getJSON('data/homepage-content.json').done(function (contentResponse) {
      renderHomepageContent(contentResponse);
    }).fail(function () {
      var guidelinesSlot = document.getElementById('guidelines-paragraphs-slot');
      if (guidelinesSlot) {
        guidelinesSlot.innerHTML += '<p>Using fallback page content because homepage data could not be loaded.</p>';
      }
    });

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
