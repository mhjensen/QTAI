(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.sr-only').textContent = 'Open navigation';
    nav.classList.remove('is-open');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var opened = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(opened));
      toggle.querySelector('.sr-only').textContent = opened ? 'Close navigation' : 'Open navigation';
      nav.classList.toggle('is-open', opened);
    });
    nav.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(); toggle.focus();
      }
    });
    var desktop = window.matchMedia('(min-width: 801px)');
    if (desktop.addEventListener) desktop.addEventListener('change', function (event) { if (event.matches) closeMenu(); });
  }
  var filters = document.querySelectorAll('[data-filter]');
  var courses = document.querySelectorAll('.course');
  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      var selected = button.dataset.filter;
      var visible = 0;
      filters.forEach(function (item) {
        var active = item === button;
        item.setAttribute('aria-pressed', String(active));
        item.classList.toggle('active', active);
      });
      courses.forEach(function (course) {
        var show = selected === 'all' || course.dataset.audience.split(' ').includes(selected);
        course.hidden = !show;
        if (show) visible += 1;
      });
      document.getElementById('course-count').textContent = 'Showing ' + visible + (visible === 1 ? ' course' : ' courses');
    });
  });
  var filterGroup = document.querySelector('.course-filters');
  if (filterGroup) filterGroup.hidden = false;
  var form = document.getElementById('enquiry-form');
  var result = document.getElementById('enquiry-result');
  var topic = document.getElementById('topic');
  var message = document.getElementById('message');
  document.querySelectorAll('[data-topic], [data-course]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!topic || !message) return;
      if (link.dataset.course) {
        topic.value = 'Intensive courses';
        if (!message.value.trim()) {
          message.value = 'I would like to discuss the course “' + link.dataset.course + '” for our team.\n\n';
        } else if (!message.value.includes(link.dataset.course)) {
          message.value += '\n\nCourse of interest: ' + link.dataset.course;
        }
      } else {
        topic.value = link.dataset.topic;
      }
      if (result) result.hidden = true;
    });
  });
  if (form && result) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var fields = new FormData(form);
      function value(key) { return String(fields.get(key) || '').trim(); }
      var subject = 'QTAI enquiry: ' + value('topic');
      var lines = ['Hello Morten,', '', value('message'), '', 'Kind regards,', value('name'), value('email')];
      if (value('organisation')) lines.push(value('organisation'));
      lines.push('', 'Interest: ' + value('topic'));
      var emailLink = document.getElementById('enquiry-email-link');
      emailLink.href = 'mailto:mhjensen@uio.no?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\r\n'));
      result.hidden = false;
      emailLink.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    });
    form.addEventListener('input', function () { result.hidden = true; });
    form.hidden = false;
  }
  var year = document.getElementById('copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window && nav) {
    var observed = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll('a').forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(function (section) { observed.observe(section); });
  }
})();
