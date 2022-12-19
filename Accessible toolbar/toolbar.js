/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   FormatToolbar.js
 */

/* global FormatToolbarItem, FontMenuButton, SpinButton */

'use strict';

/**
 * @class
 * @description
 *  Format Toolbar object representing the state and interactions for a toolbar widget
 *  to format the text in a textarea element
 * @param domNode
 *  The DOM node pointing to the element with the toolbar tole
 */
function FormatToolbar(domNode) {
  this.domNode = domNode;
  this.firstItem = null;
  this.lastItem = null;

  this.toolbarItems = [];
  this.alignItems = [];
  this.textarea = null;

  this.copyButton = null;
  this.cutButton = null;

  this.start = null;
  this.end = null;
  this.ourClipboard = '';
  this.selected = null;

  this.nightModeCheck = null;
}

FormatToolbar.prototype.init = function () {
  var i, items, toolbarItem, menuButton;

  this.textarea = document.getElementById(
    this.domNode.getAttribute('aria-controls')
  );
  this.textarea.style.width =
    this.domNode.getBoundingClientRect().width - 12 + 'px';
  this.textarea.addEventListener('mouseup', this.selectTextContent.bind(this));
  this.textarea.addEventListener('keyup', this.selectTextContent.bind(this));
  this.domNode.addEventListener('click', this.handleContainerClick.bind(this));

  this.selected = this.textarea.selectText;

  this.copyButton = this.domNode.querySelector('.copy');
  this.cutButton = this.domNode.querySelector('.cut');
  this.pasteButton = this.domNode.querySelector('.paste');

  this.nightModeCheck = this.domNode.querySelector('.nightmode');
  items = this.domNode.querySelectorAll('.item');

  for (i = 0; i < items.length; i++) {
    toolbarItem = new FormatToolbarItem(items[i], this);
    toolbarItem.init();

    if (items[i].hasAttribute('aria-haspopup')) {
      menuButton = new FontMenuButton(items[i], this, toolbarItem);
      menuButton.init();
    }

    if (i === 0) {
      this.firstItem = toolbarItem;
    }
    this.lastItem = toolbarItem;
    this.toolbarItems.push(toolbarItem);
  }

  var spinButtons = this.domNode.querySelectorAll('[role=spinbutton]');

  for (i = 0; i < spinButtons.length; i++) {
    var s = new SpinButton(spinButtons[i], this);
    s.init();
  }
};

FormatToolbar.prototype.handleContainerClick = function () {
  if (event.target !== this.domNode) return;
  this.setFocusCurrentItem();
};

FormatToolbar.prototype.setFocusCurrentItem = function () {
  var item = this.domNode.querySelector('[tabindex="0"]');
  item.focus();
};

FormatToolbar.prototype.selectTextContent = function () {
  this.start = this.textarea.selectionStart;
  this.end = this.textarea.selectionEnd;
  this.selected = this.textarea.value.substring(this.start, this.end);
  this.updateDisable(
    this.copyButton,
    this.cutButton,
    this.pasteButton,
    this.selected
  );
};
FormatToolbar.prototype.updateDisable = function (
  copyButton,
  cutButton,
  pasteButton
) {
  var start = this.textarea.selectionStart;
  var end = this.textarea.selectionEnd;
  if (start !== end) {
    copyButton.setAttribute('aria-disabled', false);
    cutButton.setAttribute('aria-disabled', false);
  } else {
    copyButton.setAttribute('aria-disabled', true);
    cutButton.setAttribute('aria-disabled', true);
  }
  if (this.ourClipboard.length > 0) {
    pasteButton.setAttribute('aria-disabled', false);
  }
};

FormatToolbar.prototype.selectText = function (start, end, textarea) {
  if (typeof textarea.selectionStart !== 'undefined') {
    textarea.focus();
    textarea.selectionStart = start;
    textarea.selectionEnd = end;
    return true;
  }
};
FormatToolbar.prototype.copyTextContent = function () {
  if (this.copyButton.getAttribute('aria-disabled') === 'true') {
    return;
  }
  this.selectText(this.start, this.end, this.textarea);
  this.ourClipboard = this.selected;
  this.updateDisable(
    this.copyButton,
    this.cutButton,
    this.pasteButton,
    this.selected
  );
};

FormatToolbar.prototype.cutTextContent = function (toolbarItem) {
  if (this.cutButton.getAttribute('aria-disabled') === 'true') {
    return;
  }
  this.copyTextContent(toolbarItem);
  var str = this.textarea.value;
  this.textarea.value = str.replace(str.substring(this.start, this.end), '');
  this.selected = '';
  this.updateDisable(
    this.copyButton,
    this.cutButton,
    this.pasteButton,
    this.selected
  );
};

FormatToolbar.prototype.pasteTextContent = function () {
  if (this.pasteButton.getAttribute('aria-disabled') === 'true') {
    return;
  }
  var str = this.textarea.value;
  this.textarea.value =
    str.slice(0, this.textarea.selectionStart) +
    this.ourClipboard +
    str.slice(this.textarea.selectionEnd);
  this.textarea.focus();
  this.updateDisable(
    this.copyButton,
    this.cutButton,
    this.pasteButton,
    this.selected
  );
};

FormatToolbar.prototype.toggleBold = function (toolbarItem) {
  if (toolbarItem.isPressed()) {
    this.textarea.style.fontWeight = 'normal';
    toolbarItem.resetPressed();
  } else {
    this.textarea.style.fontWeight = 'bold';
    toolbarItem.setPressed();
  }
};

FormatToolbar.prototype.toggleUnderline = function (toolbarItem) {
  if (toolbarItem.isPressed()) {
    this.textarea.style.textDecoration = 'none';
    toolbarItem.resetPressed();
  } else {
    this.textarea.style.textDecoration = 'underline';
    toolbarItem.setPressed();
  }
};

FormatToolbar.prototype.toggleItalic = function (toolbarItem) {
  if (toolbarItem.isPressed()) {
    this.textarea.style.fontStyle = 'normal';
    toolbarItem.resetPressed();
  } else {
    this.textarea.style.fontStyle = 'italic';
    toolbarItem.setPressed();
  }
};

FormatToolbar.prototype.changeFontSize = function (value) {
  this.textarea.style.fontSize = value + 'pt';
};

FormatToolbar.prototype.toggleNightMode = function () {
  if (this.nightModeCheck.checked) {
    this.textarea.style.color = '#eee';
    this.textarea.style.background = 'black';
  } else {
    this.textarea.style.color = 'black';
    this.textarea.style.background = 'white';
  }
};

FormatToolbar.prototype.redirectLink = function (toolbarItem) {
  window.open(toolbarItem.domNode.href, '_blank');
};

FormatToolbar.prototype.setAlignment = function (toolbarItem) {
  for (var i = 0; i < this.alignItems.length; i++) {
    this.alignItems[i].resetChecked();
  }
  switch (toolbarItem.value) {
    case 'left':
      this.textarea.style.textAlign = 'left';
      toolbarItem.setChecked();
      break;
    case 'center':
      this.textarea.style.textAlign = 'center';
      toolbarItem.setChecked();
      break;
    case 'right':
      this.textarea.style.textAlign = 'right';
      toolbarItem.setChecked();
      break;

    default:
      break;
  }
};

FormatToolbar.prototype.setFocusToFirstAlignItem = function () {
  this.setFocusItem(this.alignItems[0]);
};

FormatToolbar.prototype.setFocusToLastAlignItem = function () {
  this.setFocusItem(this.alignItems[2]);
};

FormatToolbar.prototype.setFontFamily = function (font) {
  this.textarea.style.fontFamily = font;
};

FormatToolbar.prototype.activateItem = function (toolbarItem) {
  switch (toolbarItem.buttonAction) {
    case 'bold':
      this.toggleBold(toolbarItem);
      break;
    case 'underline':
      this.toggleUnderline(toolbarItem);
      break;
    case 'italic':
      this.toggleItalic(toolbarItem);
      break;
    case 'align':
      this.setAlignment(toolbarItem);
      break;
    case 'copy':
      this.copyTextContent(toolbarItem);
      break;
    case 'cut':
      this.cutTextContent(toolbarItem);
      break;
    case 'paste':
      this.pasteTextContent(toolbarItem);
      break;
    case 'font-family':
      this.setFontFamily(toolbarItem.value);
      break;
    case 'nightmode':
      this.toggleNightMode(toolbarItem);
      break;
    case 'link':
      this.redirectLink(toolbarItem);
      break;
    default:
      break;
  }
};

/**
 * @description
 *  Focus on the specified item
 * @param item
 *  The item to focus on
 */
FormatToolbar.prototype.setFocusItem = function (item) {
  for (var i = 0; i < this.toolbarItems.length; i++) {
    this.toolbarItems[i].domNode.setAttribute('tabindex', '-1');
  }

  item.domNode.setAttribute('tabindex', '0');
  item.domNode.focus();
};

FormatToolbar.prototype.setFocusToNext = function (currentItem) {
  var index, newItem;

  if (currentItem === this.lastItem) {
    newItem = this.firstItem;
  } else {
    index = this.toolbarItems.indexOf(currentItem);
    newItem = this.toolbarItems[index + 1];
  }
  this.setFocusItem(newItem);
};

FormatToolbar.prototype.setFocusToPrevious = function (currentItem) {
  var index, newItem;

  if (currentItem === this.firstItem) {
    newItem = this.lastItem;
  } else {
    index = this.toolbarItems.indexOf(currentItem);
    newItem = this.toolbarItems[index - 1];
  }
  this.setFocusItem(newItem);
};

FormatToolbar.prototype.setFocusToFirst = function () {
  this.setFocusItem(this.firstItem);
};

FormatToolbar.prototype.setFocusToLast = function () {
  this.setFocusItem(this.lastItem);
};

FormatToolbar.prototype.hidePopupLabels = function () {
  var tps = this.domNode.querySelectorAll('button .popup-label');
  tps.forEach(function (tp) {
    tp.classList.remove('show');
  });
};

// Initialize toolbars

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * ARIA Toolbar Examples
 * @function onload
 * @desc Initialize the toolbar example once the page has loaded
 */

window.addEventListener('load', function () {
  var toolbars = document.querySelectorAll('[role="toolbar"].format');

  for (var i = 0; i < toolbars.length; i++) {
    var toolbar = new FormatToolbar(toolbars[i]);

    toolbar.init();
  }
});
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   FontToolbarItem.js
 */

'use strict';

function FormatToolbarItem(domNode, toolbar) {
  this.domNode = domNode;
  this.toolbar = toolbar;
  this.buttonAction = '';
  this.value = '';
  this.popupLabelNode = null;
  this.hasHover = false;
  this.popupLabelDelay = 800;

  this.keyCode = Object.freeze({
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  });
}

FormatToolbarItem.prototype.init = function () {
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.domNode.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

  document.body.addEventListener(
    'keydown',
    this.handleHideAllPopupLabels.bind(this)
  );

  if (this.domNode.classList.contains('bold')) {
    this.buttonAction = 'bold';
  }

  if (this.domNode.classList.contains('italic')) {
    this.buttonAction = 'italic';
  }

  if (this.domNode.classList.contains('underline')) {
    this.buttonAction = 'underline';
  }

  if (this.domNode.classList.contains('align-left')) {
    this.buttonAction = 'align';
    this.value = 'left';
    this.toolbar.alignItems.push(this);
  }

  if (this.domNode.classList.contains('align-center')) {
    this.buttonAction = 'align';
    this.value = 'center';
    this.toolbar.alignItems.push(this);
  }

  if (this.domNode.classList.contains('align-right')) {
    this.buttonAction = 'align';
    this.value = 'right';
    this.toolbar.alignItems.push(this);
  }
  if (this.domNode.classList.contains('nightmode')) {
    this.buttonAction = 'nightmode';
  }
  if (this.domNode.classList.contains('link')) {
    this.buttonAction = 'link';
  }
  if (this.domNode.classList.contains('copy')) {
    this.buttonAction = 'copy';
  }
  if (this.domNode.classList.contains('paste')) {
    this.buttonAction = 'paste';
  }
  if (this.domNode.classList.contains('cut')) {
    this.buttonAction = 'cut';
  }
  if (this.domNode.classList.contains('spinbutton')) {
    this.buttonAction = 'changeFontSize';
  }
  // Initialize any popup label

  this.popupLabelNode = this.domNode.querySelector('.popup-label');
  if (this.popupLabelNode) {
    var width = 8 * this.popupLabelNode.textContent.length;
    this.popupLabelNode.style.width = width + 'px';
    this.popupLabelNode.style.left =
      -1 * ((width - this.domNode.offsetWidth) / 2) - 5 + 'px';
  }
};

FormatToolbarItem.prototype.isPressed = function () {
  return this.domNode.getAttribute('aria-pressed') === 'true';
};

FormatToolbarItem.prototype.setPressed = function () {
  this.domNode.setAttribute('aria-pressed', 'true');
};

FormatToolbarItem.prototype.resetPressed = function () {
  this.domNode.setAttribute('aria-pressed', 'false');
};

FormatToolbarItem.prototype.setChecked = function () {
  this.domNode.setAttribute('aria-checked', 'true');
  this.domNode.checked = true;
};

FormatToolbarItem.prototype.resetChecked = function () {
  this.domNode.setAttribute('aria-checked', 'false');
  this.domNode.checked = false;
};

FormatToolbarItem.prototype.disable = function () {
  this.domNode.setAttribute('aria-disabled', 'true');
};

FormatToolbarItem.prototype.enable = function () {
  this.domNode.removeAttribute('aria-disabled');
};

FormatToolbarItem.prototype.showPopupLabel = function () {
  if (this.popupLabelNode) {
    this.toolbar.hidePopupLabels();
    this.popupLabelNode.classList.add('show');
  }
};

FormatToolbarItem.prototype.hidePopupLabel = function () {
  if (this.popupLabelNode && !this.hasHover) {
    this.popupLabelNode.classList.remove('show');
  }
};

// Events

FormatToolbarItem.prototype.handleHideAllPopupLabels = function (event) {
  switch (event.keyCode) {
    case this.keyCode.ESC:
      this.toolbar.hidePopupLabels();
      break;

    default:
      break;
  }
};

FormatToolbarItem.prototype.handleBlur = function () {
  this.toolbar.domNode.classList.remove('focus');

  if (this.domNode.classList.contains('nightmode')) {
    this.domNode.parentNode.classList.remove('focus');
  }
  this.hidePopupLabel();
};

FormatToolbarItem.prototype.handleFocus = function () {
  this.toolbar.domNode.classList.add('focus');

  if (this.domNode.classList.contains('nightmode')) {
    this.domNode.parentNode.classList.add('focus');
  }
  this.showPopupLabel();
};

FormatToolbarItem.prototype.handleMouseLeave = function () {
  this.hasHover = false;
  setTimeout(this.hidePopupLabel.bind(this), this.popupLabelDelay);
};

FormatToolbarItem.prototype.handleMouseOver = function () {
  this.showPopupLabel();
  this.hasHover = true;
};

FormatToolbarItem.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.ENTER:
    case this.keyCode.SPACE:
      if (
        this.buttonAction !== '' &&
        this.buttonAction !== 'bold' &&
        this.buttonAction !== 'italic' &&
        this.buttonAction !== 'underline'
      ) {
        this.toolbar.activateItem(this);
        if (this.buttonAction !== 'nightmode') {
          flag = true;
        }
      }
      break;

    case this.keyCode.RIGHT:
      this.toolbar.setFocusToNext(this);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.toolbar.setFocusToPrevious(this);
      flag = true;
      break;

    case this.keyCode.HOME:
      this.toolbar.setFocusToFirst(this);
      flag = true;
      break;

    case this.keyCode.END:
      this.toolbar.setFocusToLast(this);
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.buttonAction === 'align') {
        if (this.domNode.classList.contains('align-left')) {
          this.toolbar.setFocusToLastAlignItem();
        } else {
          this.toolbar.setFocusToPrevious(this);
        }
        flag = true;
      }
      break;
    case this.keyCode.DOWN:
      if (this.buttonAction === 'align') {
        if (this.domNode.classList.contains('align-right')) {
          this.toolbar.setFocusToFirstAlignItem();
        } else {
          this.toolbar.setFocusToNext(this);
        }
        flag = true;
      }
      break;
    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

FormatToolbarItem.prototype.handleClick = function () {
  if (this.buttonAction == 'link') {
    return;
  }

  this.toolbar.setFocusItem(this);
  this.toolbar.activateItem(this);
};
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   FontMenuButton.js
 */

/* global FontMenu */

'use strict';

function FontMenuButton(node, toolbar, toolbarItem) {
  this.domNode = node;
  this.fontMenu = false;
  this.toolbar = toolbar;
  this.toolbarItem = toolbarItem;

  this.buttonAction = 'font-family';
  this.value = '';

  this.keyCode = Object.freeze({
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    UP: 38,
    DOWN: 40,
  });
}

FontMenuButton.prototype.init = function () {
  var id = this.domNode.getAttribute('aria-controls');

  if (id) {
    var node = document.getElementById(id);

    if (node) {
      this.fontMenu = new FontMenu(node, this);
      this.fontMenu.init();
    }
  }

  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
};

FontMenuButton.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.ENTER:
    case this.keyCode.DOWN:
    case this.keyCode.UP:
      this.fontMenu.open();
      this.fontMenu.setFocusToCheckedItem();
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

FontMenuButton.prototype.handleClick = function () {
  if (this.fontMenu.isOpen()) {
    this.fontMenu.close();
  } else {
    this.fontMenu.open();
  }
};

FontMenuButton.prototype.setFontFamily = function (font) {
  this.value = font;
  this.domNode.innerHTML = font.toUpperCase() + '<span></span>';
  this.domNode.style.fontFamily = font;
  this.domNode.setAttribute('aria-label', 'Font: ' + font);
  this.toolbar.activateItem(this);
};
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   FontMenu.js
 */

/* global FontMenuItem */

'use strict';

var FontMenu = function (domNode, controllerObj) {
  var msgPrefix = 'FontMenu constructor argument domNode ';

  // Check whether domNode is a DOM element
  if (!(domNode instanceof Element)) {
    throw new TypeError(msgPrefix + 'is not a DOM Element.');
  }

  // Check whether domNode has child elements
  if (domNode.childElementCount === 0) {
    throw new Error(msgPrefix + 'has no element children.');
  }

  // Check whether domNode child elements are A elements
  var childElement = domNode.firstElementChild;

  while (childElement) {
    var menuitem = childElement.firstElementChild;

    if (menuitem && menuitem === 'A') {
      throw new Error(
        msgPrefix + 'Cannot have descendant elements are A elements.'
      );
    }
    childElement = childElement.nextElementSibling;
  }

  this.domNode = domNode;
  this.controller = controllerObj;

  this.menuitems = []; // See PopupMenu init method
  this.firstChars = []; // See PopupMenu init method

  this.firstItem = null; // See PopupMenu init method
  this.lastItem = null; // See PopupMenu init method

  this.hasFocus = false; // See MenuItem handleFocus, handleBlur
  this.hasHover = false; // See PopupMenu handleMouseover, handleMouseout
};

/*
 *   @method FontMenu.prototype.init
 *
 *   @desc
 *       Add domNode event listeners for mouseover and mouseout. Traverse
 *       domNode children to configure each menuitem and populate menuitems
 *       array. Initialize firstItem and lastItem properties.
 */
FontMenu.prototype.init = function () {
  var menuitemElements, menuitemElement, menuItem, textContent, numItems;

  // Configure the domNode itself
  this.domNode.setAttribute('tabindex', '-1');

  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

  // Traverse the element children of domNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  menuitemElements = this.domNode.querySelectorAll('[role="menuitemradio"]');

  for (var i = 0; i < menuitemElements.length; i++) {
    menuitemElement = menuitemElements[i];
    menuItem = new FontMenuItem(menuitemElement, this);
    menuItem.init();
    this.menuitems.push(menuItem);
    textContent = menuitemElement.textContent.trim();
    this.firstChars.push(textContent.substring(0, 1).toLowerCase());
  }

  // Use populated menuitems array to initialize firstItem and lastItem.
  numItems = this.menuitems.length;
  if (numItems > 0) {
    this.firstItem = this.menuitems[0];
    this.lastItem = this.menuitems[numItems - 1];
  }
};

/* EVENT HANDLERS */

FontMenu.prototype.handleMouseover = function () {
  this.hasHover = true;
};

FontMenu.prototype.handleMouseout = function () {
  this.hasHover = false;
  setTimeout(this.close.bind(this, false), 300);
};

/* FOCUS MANAGEMENT METHODS */

FontMenu.prototype.setFocusToController = function (command) {
  if (typeof command !== 'string') {
    command = '';
  }

  if (command === 'previous') {
    this.controller.toolbar.setFocusToPrevious(this.controller.toolbarItem);
  } else {
    if (command === 'next') {
      this.controller.toolbar.setFocusToNext(this.controller.toolbarItem);
    } else {
      this.controller.domNode.focus();
    }
  }
};

FontMenu.prototype.setFontFamily = function (menuitem, font) {
  for (var i = 0; i < this.menuitems.length; i++) {
    var mi = this.menuitems[i];
    mi.domNode.setAttribute('aria-checked', mi === menuitem);
  }
  this.controller.setFontFamily(font);
};

FontMenu.prototype.setFocusToFirstItem = function () {
  this.firstItem.domNode.focus();
};

FontMenu.prototype.setFocusToLastItem = function () {
  this.lastItem.domNode.focus();
};

FontMenu.prototype.setFocusToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstItem) {
    this.lastItem.domNode.focus();
  } else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index - 1].domNode.focus();
  }
};

FontMenu.prototype.setFocusToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastItem) {
    this.firstItem.domNode.focus();
  } else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index + 1].domNode.focus();
  }
};

FontMenu.prototype.setFocusToCheckedItem = function () {
  for (var index = 0; index < this.menuitems.length; index++) {
    if (this.menuitems[index].domNode.getAttribute('aria-checked') === 'true') {
      this.menuitems[index].domNode.focus();
    }
  }
};

FontMenu.prototype.setFocusByFirstCharacter = function (currentItem, char) {
  var start, index;

  char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menuitems.indexOf(currentItem) + 1;
  if (start === this.menuitems.length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(start, char);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(0, char);
  }

  // If match was found...
  if (index > -1) {
    this.menuitems[index].domNode.focus();
  }
};

FontMenu.prototype.getIndexFirstChars = function (startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[i]) {
      return i;
    }
  }
  return -1;
};

/* Focus methods */

FontMenu.prototype.setFocus = function () {
  this.hasFocus = true;
  this.domNode.classList.add('focus');
  this.controller.toolbar.domNode.classList.add('focus');
};

FontMenu.prototype.removeFocus = function () {
  this.hasFocus = false;
  this.domNode.classList.remove('focus');
  this.controller.toolbar.domNode.classList.remove('focus');
  setTimeout(this.close.bind(this, false), 300);
};

/* MENU DISPLAY METHODS */

FontMenu.prototype.isOpen = function () {
  return this.controller.domNode.getAttribute('aria-expanded') === 'true';
};

FontMenu.prototype.open = function () {
  // Get bounding rectangle of controller object's DOM node
  var rect = this.controller.domNode.getBoundingClientRect();

  // Set CSS properties
  this.domNode.style.display = 'block';
  this.domNode.style.position = 'absolute';
  this.domNode.style.top = rect.height - 1 + 'px';
  this.domNode.style.left = '0px';
  this.domNode.style.zIndex = 100;

  // Set aria-expanded attribute
  this.controller.domNode.setAttribute('aria-expanded', 'true');
};

FontMenu.prototype.close = function (force) {
  if (typeof force !== 'boolean') {
    force = false;
  }

  if (
    force ||
    (!this.hasFocus && !this.hasHover && !this.controller.hasHover)
  ) {
    this.domNode.style.display = 'none';
    this.controller.domNode.removeAttribute('aria-expanded');
  }
};
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   FontMenuItem.js
 */

'use strict';

/*
 *   @constructor MenuItem
 *
 *   @desc
 *       Wrapper object for a simple menu item in a popup menu
 *
 *   @param domNode
 *       The DOM element node that serves as the menu item container.
 *       The menuObj PopupMenu is responsible for checking that it has
 *       requisite metadata, e.g. role="menuitem".
 *
 *   @param menuObj
 *       The object that is a wrapper for the PopupMenu DOM element that
 *       contains the menu item DOM element. See PopupMenuAction.js
 */
var FontMenuItem = function (domNode, fontMenu) {
  this.domNode = domNode;
  this.fontMenu = fontMenu;
  this.font = '';

  this.keyCode = Object.freeze({
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  });
};

FontMenuItem.prototype.init = function () {
  this.domNode.setAttribute('tabindex', '-1');

  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'menuitemradio');
  }

  this.font = this.domNode.textContent.trim().toLowerCase();

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
};

/* EVENT HANDLERS */

FontMenuItem.prototype.handleKeydown = function (event) {
  var flag = false,
    char = event.key;

  function isPrintableCharacter(str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  if (event.shiftKey) {
    if (isPrintableCharacter(char)) {
      this.fontMenu.setFocusByFirstCharacter(this, char);
    }
  } else {
    switch (event.keyCode) {
      case this.keyCode.SPACE:
      case this.keyCode.ENTER:
        this.handleClick(event);
        flag = true;
        break;

      case this.keyCode.ESC:
        this.fontMenu.setFocusToController();
        this.fontMenu.close(true);
        flag = true;
        break;

      case this.keyCode.UP:
        this.fontMenu.setFocusToPreviousItem(this);
        flag = true;
        break;

      case this.keyCode.DOWN:
        this.fontMenu.setFocusToNextItem(this);
        flag = true;
        break;

      case this.keyCode.RIGHT:
        flag = true;
        break;

      case this.keyCode.LEFT:
        flag = true;
        break;

      case this.keyCode.HOME:
      case this.keyCode.PAGEUP:
        this.fontMenu.setFocusToFirstItem();
        flag = true;
        break;

      case this.keyCode.END:
      case this.keyCode.PAGEDOWN:
        this.fontMenu.setFocusToLastItem();
        flag = true;
        break;

      case this.keyCode.TAB:
        this.fontMenu.setFocusToController();
        this.fontMenu.close(true);
        break;

      default:
        if (isPrintableCharacter(char)) {
          this.fontMenu.setFocusByFirstCharacter(this, char);
        }
        break;
    }
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

FontMenuItem.prototype.handleClick = function () {
  this.fontMenu.setFontFamily(this, this.font);
  this.fontMenu.setFocusToController();
  this.fontMenu.close(true);
};

FontMenuItem.prototype.handleFocus = function () {
  this.fontMenu.setFocus();
};

FontMenuItem.prototype.handleBlur = function () {
  this.fontMenu.removeFocus();
};

FontMenuItem.prototype.handleMouseover = function () {
  this.fontMenu.hasHover = true;
  this.fontMenu.open();
};

FontMenuItem.prototype.handleMouseout = function () {
  this.fontMenu.hasHover = false;
  setTimeout(this.fontMenu.close.bind(this.fontMenu, false), 300);
};
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   SpinButton.js
 */

'use strict';

// Create SpinButton that contains value, valuemin, valuemax, and valuenow
var SpinButton = function (domNode, toolbar) {
  this.domNode = domNode;
  this.toolbar = toolbar;

  this.valueDomNode = domNode.querySelector('.value');
  this.increaseDomNode = domNode.querySelector('.increase');
  this.decreaseDomNode = domNode.querySelector('.decrease');

  this.valueMin = 8;
  this.valueMax = 40;
  this.valueNow = 12;
  this.valueText = this.valueNow + ' Point';

  this.keyCode = Object.freeze({
    UP: 38,
    DOWN: 40,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
  });
};

// Initialize slider
SpinButton.prototype.init = function () {
  if (this.domNode.getAttribute('aria-valuemin')) {
    this.valueMin = parseInt(this.domNode.getAttribute('aria-valuemin'));
  }

  if (this.domNode.getAttribute('aria-valuemax')) {
    this.valueMax = parseInt(this.domNode.getAttribute('aria-valuemax'));
  }

  if (this.domNode.getAttribute('aria-valuenow')) {
    this.valueNow = parseInt(this.domNode.getAttribute('aria-valuenow'));
  }

  this.setValue(this.valueNow);

  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));

  this.increaseDomNode.addEventListener(
    'click',
    this.handleIncreaseClick.bind(this)
  );
  this.decreaseDomNode.addEventListener(
    'click',
    this.handleDecreaseClick.bind(this)
  );
};

SpinButton.prototype.setValue = function (value) {
  if (value > this.valueMax) {
    value = this.valueMax;
  }

  if (value < this.valueMin) {
    value = this.valueMin;
  }

  this.valueNow = value;
  this.valueText = value + ' Point';

  this.domNode.setAttribute('aria-valuenow', this.valueNow);
  this.domNode.setAttribute('aria-valuetext', this.valueText);

  if (this.valueDomNode) {
    this.valueDomNode.innerHTML = this.valueText;
  }

  this.toolbar.changeFontSize(value);
};

SpinButton.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.DOWN:
      this.setValue(this.valueNow - 1);
      flag = true;
      break;

    case this.keyCode.UP:
      this.setValue(this.valueNow + 1);
      flag = true;
      break;

    case this.keyCode.PAGEDOWN:
      this.setValue(this.valueNow - 5);
      flag = true;
      break;

    case this.keyCode.PAGEUP:
      this.setValue(this.valueNow + 5);
      flag = true;
      break;

    case this.keyCode.HOME:
      this.setValue(this.valueMin);
      flag = true;
      break;

    case this.keyCode.END:
      this.setValue(this.valueMax);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.preventDefault();
    event.stopPropagation();
  }
};

SpinButton.prototype.handleIncreaseClick = function (event) {
  this.setValue(this.valueNow + 1);

  event.preventDefault();
  event.stopPropagation();
};

SpinButton.prototype.handleDecreaseClick = function (event) {
  this.setValue(this.valueNow - 1);

  event.preventDefault();
  event.stopPropagation();
};
