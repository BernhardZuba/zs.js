/**
MIT License

Copyright (c) 2017 Bernhard Zuba

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var zs = (function zs() {
   'use strict';

   let config = function config() {
      // Make these variables read only through functions (for security concerns)!
      let confs = {DEBUG:       false,
                   DEBUG_LEVEL: 0,
                   PATHS: { HTML: 'fragments/',
                            CONTROLLER_SHARED: 'controllers/shared/',
                            CONTROLLER_FRAGMENT: 'controllers/fragments/',
                            REQUEST_URL: 'php/req/ajax.php'
                   },
                   NAMESPACE_MAIN: 'zs',
                   NAMESPACE_DELIMITER: '\\',
                   LABELS_CLASS: 'helper\\req\\labels',
                   LABELS_METHOD: 'getLabels',
                   FRAGMENT_FILE_EXTENSION: 'htm',
                   SELECTORS: {
                      PAGE_CONTENT: 'main'
                   }
      },

      getPathOfHTML = function getPathOfHTML() {
         return confs.PATHS.HTML;
      },
      getPathOfControllerShared = function getPathOfControllerShared() {
         return confs.PATHS.CONTROLLER_SHARED;
      },
      getPathOfControllerFragment = function getPathOfControllerFragment() {
         return confs.PATHS.CONTROLLER_FRAGMENT;
      },
      getRequestURL = function getRequestURL() {
         return confs.PATHS.REQUEST_URL;
      },
      getObjectMainNamespace = function getObjectMainNamespace() {
         return confs.NAMESPACE_MAIN;
      },
      getNamespaceDelimiter = function getNamespaceDelimiter() {
         return confs.NAMESPACE_DELIMITER;
      },
      getSelectorOfPageContent = function getSelectorOfPageContent() {
         return confs.SELECTORS.PAGE_CONTENT;
      },
      getLabelsClass = function getLabelsClass() {
         return confs.LABELS_CLASS;
      },
      getLabelsMethod = function getLabelsMethod() {
         return confs.LABELS_METHOD;
      },
      getFragmentExtension = function getFragmentExtension() {
         return confs.FRAGMENT_FILE_EXTENSION;
      }
      
      return {
         DEBUG: confs.DEBUG,              // this variable could be also set dynamically
         DEBUG_LEVEL: confs.DEBUG_LEVEL,  // this variable could be also set dynamically
         getPathOfHTML              : getPathOfHTML,
         getPathOfControllerShared  : getPathOfControllerShared,
         getPathOfControllerFragment: getPathOfControllerFragment,
         getRequestURL              : getRequestURL,
         getObjectMainNamespace     : getObjectMainNamespace,
         getNamespaceDelimiter      : getNamespaceDelimiter,
         getSelectorOfPageContent   : getSelectorOfPageContent,
         getLabelsClass             : getLabelsClass,
         getLabelsMethod            : getLabelsMethod,
         getFragmentExtension       : getFragmentExtension 
      }
   }();

   return { config: config }
}());

var PREVENT_HISTORY_BACK = false;





$.extend(zs, (function mainModule(global) {
   'use strict';
	
   // internationalization module
   let i18n = function i18nFunc() {
      let _labelStore  = {},
          _language    = '',

      setLabel = function setLabel(key, text) {
         _labelStore[key] = text;
      },

      getLabel = function getLabel(key) {
         return _labelStore[key];
      },

      changeLanguage = function changeLanguage(lang) {
         _labelStore  = {};   // reset label store - every label will be loaded again
         _language = lang;
      },

      getLanguage = function getLanguage() {
         if(_language.length === 0) {
            _language = navigator.language || navigator.userLanguage;
         }
         
         return _language;
      }

      return {
         setLabel      : setLabel,
         getLabel      : getLabel,
         getLanguage   : getLanguage,
         changeLanguage: changeLanguage
      }
   }(),

   // history module
   history = function history() {
      // LIFO-stack (last in - first out)
      let _history = [],
          _savedInputState = {},
          _handleHistoryBack = true,

      // TODO: Functionality that handles the history back button
      handleHistoryBack = function handleHistoryBack() {
         if(_handleHistoryBack === false) {
            return;
         }
         _savedInputState = {};
      },

      // This functions saves the input state after the transition has ended (including HTML manipulating and set values)
      saveActualInputState = function saveActualInputState() {
         _savedInputState = zs.formular.get();
      },
      
      // Adds a new JSON-object to the history stack
      add = function add(object) {
         _savedInputState  = {};
         
         _history.push(object);
         history.pushState(_history, null, document.location.href);
      },

      // Retrives the last history item
      pop = function pop() {
         var u_historyElement = {};
         if(_history.length > 0) {
            u_historyElement = _history.pop();
         }
         history.replaceState(_history, null, document.location.href);
         return u_historyElement;
      },

      // Deletes an entry of the history
      del = function del(nr) {
         var u_history = $.grep(_history, function(item, idx) {
           return ( idx !== nr );
         });
         _history = u_history;
         history.replaceState(_history, null, document.location.href);
      },
      
      // Returns the whole history stack
      get = function get() {
         return _history;
      },
      
      // Returns the length of the history
      length = function length() {
         return _history.length;
      },
      
      // Resets the history
      clear = function clear() {
         _history = [];
         history.replaceState(_history, null, document.location.href);
      },
      
      // Checks if there was a change on the actual screen
      checkFormularChanges = function checkFormularChanges() {
         if(Object.keys(_savedInputState).length > 0) {
            if((JSON.stringify(zs.formular.get()) === JSON.stringify(_savedInputState)) === false) {
               _handleHistoryBack = true; // TODO: Maybe false - There was a change! -> Ask the user what to do!
            } else {
               _handleHistoryBack = true;
            }
         } else {
            _handleHistoryBack = true;
         }
      }
      
      return {
         handleHistoryBack: handleHistoryBack,
         saveActualInputState: saveActualInputState,
         checkFormularChanges: checkFormularChanges,
         add: add,
         pop: pop,
         get: get,
         del: del,
         clear: clear,
         length: length
      }
   }(),

   /* 
    * Level 1 = Error messages
    *       2 =      TBD - not used yet
    *       3 = Warning messages
    *       7 =      TBD - not used yet
    *       5 = Info messages
    *       6 =      TBD - not used yet
    *       7 = Success messages
    *       8 =      TBD - not used yet   - at this level and above automatically the call stack is printed to console
    *       9 = Debug messages
    */
   debug = function debug(msg, level, forceCallStack) {
      if(level === undefined || zs.config.DEBUG_LEVEL >= level) {
         if((zs.config.DEBUG_LEVEL >= 8 && level >= 8) || forceCallStack === true) {
            try { throw new Error(); }
            catch (e) {
               console.log("Call stack: " + e.stack.replace('Error',''));
            }
         }
         console.log(msg);
      }
   },

   // module to show messages to the user
   message = function message() {
      let _msgStore = [],
      
      // For single messages (e.g. "toasts" or "snackbar") [type can be optional - depends on the implementation]
      show = function show(text, type) {
         console.log(type + ':' + text);
      },
      
      // Add a message to show them via the showMultiple function
      add = function add(text, type) {
         _msgStore.push({text: text, type: type});
      },
      
      // Displays multiple messages on the screen
      showMultiple = function showMultiple() {
         // TODO: Some display logic
         
         _msgStore.forEach(function traverseMsgs(msg) {
            console.log(msg.type + ':' + msg.text);
         });
         
         _msgStore = [];
      },
      
      processMsgs = function processMsgs(msgs) {
         msgs.forEach(function traverseMsgs(msg) {
            add(msg.text, msg.type);
         });
         
         showMultiple();
      },
      
      // Removes all the displayed messages on the screen
      remove = function remove(force) {
         
      }
      
      return {
         show        : show,
         showMultiple: showMultiple,
         add         : add,
         remove      : remove,
         processMsgs : processMsgs
      }
   }(),

   // loading module
   loading = function loading() {
      let show = function show(loadingText) {
         
      },
      
      hide = function hide() {
         
      }
      
      return {
         show: show,
         hide: hide
      }
   }(),

   network = function network() {
      let _sessionID = '',
          _encKey = '',
          _checksumkey = '',

      _calculateEncryptionAndChecksumKey = function _calculateEncryptionAndChecksumKey() {
         var u_crypto = global.CryptoJS;

         // TODO: Some calculations...
         _encKey = '';
         _checksumkey = '';
      },

      _encrypt = function _encrypt(data) {
         var u_crypto = global.CryptoJS;
         
         if(_encKey.length > 0) {
            // TODO: Some encryption logic
         }
         return data;
      },
      
      _calculateChecksum = function _calculateChecksum(data) {
         var u_crypto = global.CryptoJS,
             u_checksum = '';
         
         if(_checksumkey.length > 0) {
            // TODO: Some individual checksum logic
            u_checksum = u_crypto.SHA512(u_data + _checksumkey).toString();
         }
         
         return u_checksum;
      },
      
      /* Returns an AJAX request object */
      post = function post(options) {
         var u_conf = $.extend({
               object : "",
               method : "",
               data : {},
               async: true,
               loading: false,
               anotherRequest: false,
               disableForm: false,
               disableFormSelector: zs.config.getSelectorOfPageContent(),
               success : function postDataSuccess() {
                  return true;
               },
            }, options),
         u_data = JSON.stringify(u_conf.data),
         u_request = [],
         u_checksum = "",
         u_sessID = _sessionID,
         u_tmpToken = ''; // TODO

         if (_encKey.length === 0) {
            // Calculate only once
            _calculateEncryptionAndChecksumKey();
         }

         // Replace the euro sign to escaped unicode representation...
         u_data = u_data.replace(new RegExp(String.fromCharCode(8364),'g'),'\\u20ac');
         u_data = _encrypt(u_data);

         u_checksum = _calculateChecksum(u_data);

         /* Split up records bigger data than 32K - there are languages which only support 32K */
         while (u_data.length > 30000) {
            u_request.push({
               "s" : u_sessID,
               "o" : zs.config.getObjectMainNamespace() + zs.config.getNamespaceDelimiter() + u_conf.object,
               "m" : u_conf.method,
               "n" : u_request.length,
               "d" : u_data.substring(0, 30000),
               "c" : u_checksum,
               "t" : u_tmpToken
            });
            /* To save a little bit bandwidth */
            u_conf.object = "";
            u_conf.method = "";
            u_tmpToken = "";
            u_sessID = "";
            u_data = u_data.substring(30000, u_data.length);
         }

         if (u_data.length > 0 && u_data.length <= 30000) {
            u_request.push({
               "s" : u_sessID,
               "o" : zs.config.getObjectMainNamespace() + zs.config.getNamespaceDelimiter() + u_conf.object,
               "m" : u_conf.method,
               "n" : u_request.length,
               "d" : u_data.substring(0, 30000),
               "c" : u_checksum,
               "t" : u_tmpToken
            });
         }

         if(u_conf.disableForm === true) {
            zs.formular.disable(u_conf.disableFormSelector, true);
         }

         if(u_conf.loading === true) {
            zs.message.remove();
            zs.loading.show();
         }

         return $.ajax({
            type : 'POST',
            url : zs.config.getRequestURL(),
            contentType : 'text/json; charset=UTF-8',
            cache : false,
            data : JSON.stringify({
               "jsonReq" : u_request
            }),
            dataType : 'json',
            async: u_conf.async,
            success : function postDataAjaxSuccess(json) {
               if(json.xhrerror) {
                  console.log({request: u_conf, result: json});
                  if(json.xhrerror.toLowerCase() === 'access denied' || json.xhrerror.toLowerCase() === 'checksum mismatch') {
                     alert('Error: No permission!');
                  }
               } else {
                  if(u_conf.anotherRequest === false) {
                     if(u_conf.loading === true) {
                        zs.loading.hide();
                     }

                     if(u_conf.disableForm === true) {
                        zs.formular.enable(u_conf.disableFormSelector, true);
                     }
                  }

                  if (u_conf.success !== undefined && u_conf.success !== null) {                 
                     u_conf.success(json);
                  }
               }
            },
            error : function postDataAjaxError(xhr, errorMessage, thrownError) {
               if (xhr.statusText.toLowerCase() !== "abort" && xhr.statusText.toLowerCase() !== "unknown" && xhr.statusText !== "") {
                  alert("Error: " + xhr.statusText + " " + errorMessage);
                  
                  if(errorMessage.toLowerCase() === 'parsererror') {
                     console.log(xhr.responseText);
                     console.log(JSON.parse(xhr.responseText));
                  }
               }
            }
         });
      },
      
      setSessionID = function setSessionID(sessid) {
         _sessionID = sessid;
      }
      
      return {
         post: post,
         setSessionID: setSessionID
      }
   }(),
   
   // content management module
   content = function content() {
      // Submodule for program transtions
      let transitions = function transitions() {
         let _transitionMapping = {},
         
         run = function run(nameOfTransition, selector, newHTML, fromToElement, manipulateHTMLFunc, setValuesFunc) {
            return new Promise(function waitUntilTransitionEnds(resolve) {
               zs.message.remove(true);
               
               if(_transitionMapping[nameOfTransition] === undefined) {
                  alert('Error: Transtion not found: ' + nameOfTransition);
                  return;
               }

               if(nameOfTransition.indexOf('Reverse') === -1) {
                  _transitionMapping[nameOfTransition].func(selector, newHTML, fromToElement, manipulateHTMLFunc, setValuesFunc, resolve);
               } else {
                  _transitionMapping[nameOfTransition].reverse(selector, newHTML, fromToElement, manipulateHTMLFunc, setValuesFunc, resolve);
               }
            });
         },

         registerTransition = function registerTransition(nameOfTransition, transitionFunc, transitionReverseFunc) {
            _transitionMapping[nameOfTransition] = {func: transitionFunc, reverse: transitionReverseFunc};
         },

         _none = function _none(selector, newHTML, fromToElement, manipulateHTMLFunc, setValuesFunc, resolveTransitionEnd) {
            $(selector).html(newHTML);

            if(manipulateHTMLFunc !== undefined && manipulateHTMLFunc !== null) {
               var taskManipulatePromise = manipulateHTMLFunc();

               taskManipulatePromise.then(function taskManipulateSuccess() {
                  if (setValuesFunc !== undefined && setValuesFunc !== null) {
                     var u_valuesSet = setValuesFunc();
                     u_valuesSet.then(function saveInputState() {
                        // Save the actual input state, so that we can diff the state after loading and the actual state
                        zs.history.saveActualInputState();
                        resolveTransitionEnd();
                     });
                  } else {
                     resolveTransitionEnd();
                  }
               });
            } else {
               resolveTransitionEnd();
            }
         }
		 

         registerTransition('none', _none, _none); // In this case we can consume the same function for both (normal and reverse)
         
         return {
            run: run,
            registerTransition: registerTransition
         }
      }(),
      
      // Loads a html-file with optional labels
      _loadHTML = function _loadHTML(u_conf) {
         let u_request = {
                fragment : u_conf.fragment,
                labels   : u_conf.labels,
                language : zs.i18n.getLanguage(),
             },
             u_tmpLabels = [],
             u_fragmentTransitionPromise = null,
             u_idx = 0;
         
         // Remove all displayed messages
         zs.message.remove(true);
         
         // Only load the labels which aren't loaded already
         u_tmpLabels = u_request.labels;
         u_request.labels.forEach(function traverseLabels(key) {
            u_idx++;
            if(zs.i18n.getLabel(key).length > 0) {
               u_tmpLabels.splice(u_idx, 1);
            }
         });
         u_request.labels = u_tmpLabels;
         u_tmpLabels = []; // Reset variable
         
         u_conf.fragment = u_conf.fragment.replace(/\.\./g,'');
         u_conf.fragment = u_conf.fragment.replace(/\/\//g,'');
         
         $.ajax({ type : 'POST',
                  url : zs.config.getPathOfHTML() + u_conf.fragment + '.' + zs.config.getFragmentExtension(),
                  contentType : 'text/htm',
                  cache : false,
                  success : function success(html) {
                     var u_htmllabels = html.split('[[');

                     u_htmllabels.shift();

                     u_htmllabels.forEach(function(elem) {
                        let key = elem.split(']]')[0];

                        u_tmpLabels.push(key);
                        if(u_request.labels.indexOf(key) === -1 && zs.i18n.getLabel(key).length === 0) {
                           u_request.labels.push(key);
                        }
                     });

                     network.post({object : zs.config.getLabelsClass(),
                                   method : zs.config.getLabelsMethod(),
                                   data   : u_request,
                                   success: function loadLabels(json) {
                                      //zs.history.addHistory(u_historyObject);

                                      if (json.labels) {
                                         // Add new labels to labelstore
                                         $.each(json.labels, function addBesch(key, val) {
                                            zs.i18n.setLabel(key, val);
                                         });
                                      }
                                      
                                      // Replace labels from HTML
                                      u_tmpLabels.forEach(function traverseLabels(key) {
                                         html = html.replace(new RegExp('\\[\\[' + key + '\\]\\]', 'g'), zs.i18n.getLabel(key));
                                      });

                                      u_fragmentTransitionPromise = zs.content.transitions.run(u_conf.transition, u_conf.container, html, u_conf.transitionElement, u_conf.manipulateHTML, u_conf.setValues);

                                      u_fragmentTransitionPromise.then(function startSuccess() {
                                         if (u_conf.anotherRequest === false) {
                                            zs.loading.hide();
                                         }
                                         
                                         if (u_conf.success !== undefined && u_conf.success !== null) {
                                             u_conf.success(json);
                                         }
                                      });
                                   },
                                   error: function error() {
                                      zs.debug(u_conf.fragment, 1, true);
                                      zs.loading.hide();
                                      zs.message.show(zs.i18n.getLabel('internet connection required'), 'error');
                                   },
                                   anotherRequest : u_conf.anotherRequest
                     });
                  },
                  error: function error() {
                     zs.debug(u_conf.fragment, 1, true);
                     zs.loading.hide();
                     zs.message.show(zs.i18n.getLabel('internet connection required'), 'error');
                  }
         }); // $.ajax({
      },
      
      loadFragment = function loadFragment(options) {
         let u_conf = $.extend({ container        : zs.config.getSelectorOfPageContent(), // jQuery-selector of container
                                 controller       : '',                                   // Name of controller-script
                                 sharedControllers: [],                                   // Array with string-values (Names of controller-script)
                                 fragment         : '',                                   // HTML-file of the fragment/component
                                 labels           : [],                                   // Array with label-string-values
                                 success : function success() {
                                    return true;
                                 },
                                 manipulateHTML : function manipulateHTML() {
                                    return new Promise(function manipulatePromise(resolve, reject) {  // jshint ignore:line
                                       resolve();
                                    });
                                 },
                                 setValues : function setValues() {
                                    return new Promise(function manipulatePromise(resolve, reject) {  // jshint ignore:line
                                       resolve();
                                    });
                                 },
                                 transition        : 'none',
                                 transitionElement : null,
                                 loadingText       : ''
                              }, options),
             u_scripts = [],
             u_loaded  = 0;

         if(u_conf.fragment.length <= 3) {
            console.log('Error: loadFragment - Script and/or program is empty. ' + u_conf.script + ' ; ' + u_conf.fragment);
            return;
         }

         zs.loading.show(u_conf.loadingText);

         u_conf.sharedControllers.forEach(function traverseScripts(script) {
            script = script.replace(/\.\./g,'');
            script = script.replace(/\/\//g,'');
            u_scripts.push(zs.config.getPathOfControllerShared() + script + '.js');
         });
         // The fragment-controller-script has to be loaded at last
         u_conf.controller = u_conf.controller.replace(/\.\./g,'');
         u_conf.controller = u_conf.controller.replace(/\/\//g,'');
         u_scripts.push(zs.config.getPathOfControllerFragment() + u_conf.controller + '.js');

         // Load all controller scripts
         u_scripts.forEach(function loadScript(script) {
            // jQureys getScript causes a popstate-Event
            global.PREVENT_HISTORY_BACK = true;
            $.getScript(script).done(
                        function scriptLoaded() {
                           global.PREVENT_HISTORY_BACK = false;
                           u_loaded++;
                           if(u_loaded >= u_scripts.length) {
                              _loadHTML(u_conf);
                           }
                        }
                     ).fail(function(jqxhr, settings, exception) {
                        global.PREVENT_HISTORY_BACK = false;
                        zs.debug(script + ': ' + exception, 1, true);
                        zs.loading.hide();
                        //message(getBesch('AMO0010', 12), 'error');
                     });
         });
      }
      
      return {
         loadFragment: loadFragment,
         transitions: transitions
      }
   }(),

   // file module
   file = (function fileFunctions() {
      var getFileData = function getFileData(file) {
         var u_filename = '',
             u_filesize = '',
             u_filetype = '';
         
         if ('name' in file)
            u_filename = file.name;
         else
            u_filename = file.fileName;

         if ('size' in file)
            u_filesize = file.size;
         else
            u_filesize = file.fileSize;

         if ('type' in file)
            u_filetype = file.type;
         else
            u_filetype = file.fileType;
         
         return {name: u_filename, type: u_filetype, size: u_filesize};
      },
      
      // success function gets the file content as parameter
      getFileContent = function getFileContent(file, successFunc) {
         var u_reader = new FileReader();
         u_reader.onloadend = function readerDone(event) {
            successFunc(event.target.result);
         };
         u_reader.onerror = function readerFailed(event) {
            console.log(event);
            alert(zs.i18n.getLabel('Error during file processing'));
         }
         u_reader.readAsDataURL(file);
      },
      
      // success function gets the whole file JSON-Object
      getFileDataWithContent = function getFileDataWithContent(file, successFunc) {
         var u_fileData = getFileData(file);
         getFileContent(file, function getFileContent(fileContent) {
            u_fileData.data = fileContent;
            successFunc(u_fileData);
         });
      },
      
      storage = (function storage() {
         var _fileDataStorage = {},
         
         clear = function clear() {
            _fileDataStorage = {};
         },
         
         add = function add(fileInputID, fileData) {
            _fileDataStorage[fileInputID] = fileData;
         },
         
         del = function del(fileInputID) {
            delete _fileDataStorage[fileInputID];
         },
         
         get = function get(fileInputID) {
            return _fileDataStorage[fileInputID];
         }
         
         return {
            add: add,
            get: get,
            del: del,
            clear: clear
         }
      }())
      
      ;
      
      return {
         getFileData: getFileData,
         getFileContent: getFileContent,
         getFileDataWithContent: getFileDataWithContent,
         storage: storage
      }
   }()),
   
   // form module
   formular = function formular() {
      let set = function set(json) {
         $.each(json, function(id, val) {
                  var u_field = $('#' + id)[0],
                      u_nodeName = '';

                  if(u_field !== undefined && u_field !== null) {
                     u_nodeName = u_field.nodeName.toLowerCase();
                     
                     if(u_nodeName === 'input' || u_nodeName === 'textarea') {
                        if(u_field.type.toLowerCase() !== 'checkbox' && u_field.type.toLowerCase() !== 'radio') {
                           if(u_field.type.toLowerCase() !== 'file') {
                              if(u_field.type.toLowerCase() !== 'number') {
                                 u_field.value = val;
                              } else {
                                 u_field.value = val.replace(',','.');  // We need the German layout (period/comma problem with numbers)
                              }
                           }
                        } else {
                           u_field.checked = val;
                        }
                     } else if(u_nodeName === 'select') {
                        $(u_field).find('option[value="' + val + '"]').prop('selected', true);
                     }
                  }
               });
      },
      
      get = function get(selector) {
         let u_item = {},
             u_fields = null;
         
         if(selector === undefined) {
            u_fields = $('#content').find('input, textarea');
         } else {
            u_fields = $(selector).find('input, textarea');
         }
         
         u_fields.each(function getValues() {
                        if(this.type.toLowerCase() !== 'checkbox' && this.type.toLowerCase() !== 'radio') {
                           if(this.type.toLowerCase() !== 'number') {
                              u_item[this.id] = this.value;
                           } else {
                              u_item[this.id] = this.value.replace('.',',');  // We need the German layout (period/comma problem with numbers)
                           }
                        } else {
                           u_item[this.id] = this.checked;
                           if(this.checked && this.name) {
                              if(this.type.toLowerCase() === 'checkbox') {
                                 if(u_item[this.name] === undefined) {
                                    u_item[this.name] = [];
                                 }
                                 // If there is a checkbox, then it can be that id and name are the same - it's not an array then
                                 if(typeof u_item[this.name] === 'object') {
                                    u_item[this.name].push(this.value);
                                 }
                              } else {
                                 u_item[this.name] = this.value;
                              }
                           }
                        }
                      })
                      .end()
                      .find('select').each(function getValues() {
                        u_item[this.id] = this.value;
                      });

         return u_item;
      },
      
      disable = function disable(selector, fromFramework) {
         if(selector === undefined) {
            selector = zs.config.getSelectorOfPageContent();
         }
         
         if(fromFramework === true) {
            $(selector).find('button, input, textarea, select').prop('disabled', true).addClass('disabledByFramework');
         } else {
            $(selector).find('button, input, textarea, select').prop('disabled', true);
         }
      },
      
      enable = function enable(selector, fromFramework) {
         if(selector === undefined) {
            selector = zs.config.getSelectorOfPageContent();
         }
         
         if(fromFramework === true) {
            $(selector).find('.disabledByFramework').prop('disabled', false).removeClass('disabledByFramework');
         } else {
            $(selector).find('button, input, textarea, select').prop('disabled', false);
         }         
      }

      return {
         set: set,
         get: get,
         disable: disable,
         enable: enable
      }
   }(),
   
   modal = function modal() {
      
      let show = function show() {
         // TODO: some logical to display a modal
      },
      
      hide = function hide() {
         // TODO: some logical to hide a modal
      },
      
      remove = function remove() {
         // TODO: some logical to remove a modal
      }
      
      return {
         show : show,
         hide : hide,
         remove : remove
      }
   }(),
   
   browser =function browser() {
      let _browserConfigs = {},         // Stores all the configurations of all browsers displayed (this will be changed during interaction with the user)
          _browserConfigsOriginal = {}, // Stores all the configurations of all browsers when they were initialized
          _browserRowData = {},         // Stores all the data from all rows of a specific browser
      
      _getBrowserConfig = function _getBrowserConfig(elem) {
         if(typeof elem === 'string') {
            return _browserConfigs[elem];
         } else {
            return _browserConfigs[$(elem).parent().data('for')];            
         }
      },
      
      _getOriginalBrowserConfig = function _getOriginalBrowserConfig(elem) {
         if(typeof elem === 'string') {
            return _browserConfigsOriginal[elem];
         } else {
            return _browserConfigsOriginal[$(elem).parent().data('for')];            
         }
      },
      
      _resetOptions = function _resetOptions(brwID) {
         _browserConfigs[brwID].rowID = '';
         _browserConfigs[brwID].jumpToRowID = '';
         _browserConfigs[brwID].backward = false;
         _browserConfigs[brwID].first = false;
         _browserConfigs[brwID].last  = false;
      },
      
      _resetFilter = function _resetFilter(brwID) {
         _browserConfigs[brwID].filter = [];
      },
      
      loadData = function loadData(brwID) {
         var u_conf = _getBrowserConfig(brwID);
         
         if(u_conf.loadDataAjaxRequest) {
            // If there is already a request running - kill it and wait for the new request
            u_conf.loadDataAjaxRequest.done(function waitForRequestEnd() { _runAjaxRequest(u_conf); } );
         } else {
            _runAjaxRequest(u_conf);
         }
      },
      
      _runAjaxRequest = function _runAjaxRequest(u_conf) {
         var u_optimizedOpts = jQuery.extend(true, {}, u_conf);

         delete u_optimizedOpts.actions;
         delete u_optimizedOpts.disableFormSelector;
         delete u_optimizedOpts.fieldDatatypes;
         delete u_optimizedOpts.filterableFields;
         delete u_optimizedOpts.loadDataAjaxRequest;
         delete u_optimizedOpts.savedColumnFilter;
         delete u_optimizedOpts.sortableFields;
         delete u_optimizedOpts.theadFixed;

         u_conf.loadDataAjaxRequest = zs.network.post({
                       object  : u_conf.object,
                       method  : 'getTable',
                       data    : u_optimizedOpts,
                       disableForm: true,
                       disableFormSelector: u_conf.disableFormSelector,
                       success : function success(json) {
                          
                          // Handle error messages
                          if(json.messages) {
                             zs.message.processMsgs(json.messages);
                          }
                          
                          // Render HTML
                          if(json.data) {
                             
                          }
                          
                          if(u_opts.theadFixed === false) {
                             u_opts.theadFixed = true;
                             $('#' + u_opts.id + ' table').floatThead({ scrollContainer: function getScrollContainer() { return $('#' + u_opts.id) } });
                             //$('#' + u_opts.id + ' fthfoot').remove(); // we need this for auto-resizing after adding/removing columns
                          } else {
                             $('#' + u_opts.id + ' table').floatThead('reflow');
                          }
                          
                          if(u_opts.limit !== 0) { // Only fire load event if not only the row is refreshed
                              // HTML Loaded
                             if(u_opts.getRowids && json.data && json.data.length > 0) {
                                var u_activeRowid = json.data[0].rowid;
                                if(json.actualRowid !== undefined) {
                                   u_activeRowid = json.actualRowid;
                                }
                                
                                u_opts.loaded(u_opts.id, u_activeRowid);
                             } else {
                                u_opts.loaded(u_opts.id);
                             }
                          }
                       }
         });
         
      },
      
      setLoadingState = function setLoadingState(brwID) {
         
      },
      
      resize = function resize(brwID) {
         
      },
      
      // How many rows should be displayed?
      setRowCount = function setRowCount(count) {
         var u_conf = _getBrowserConfig(elem);
         
         _resetOptions(u_conf);
         
         u_conf.first = true;
         u_conf.limit = parseInt(count,10);
         
         setLoadingState(u_conf.id);
         loadData(u_conf);
      },
      
      navigate = function navigate(elem, direction) {
         var u_conf = _getBrowserConfig(elem);
         
         if(u_conf.navigation) {
            _resetOptions(u_conf.id);
            
            if(direction === 'first') {
               u_conf.first = true;
            }
            if(direction === 'prev') {
               u_conf.rowid = $('#' + u_conf.id + ' tbody tr:first').attr('id').split('_')[1];
               u_conf.backward = true;
            }
            if(direction === 'next') {
               u_conf.rowid = $('#' + u_conf.id + ' tbody tr:last').attr('id').split('_')[1];
            }
            if(direction === 'last') {
               u_conf.last = true;
            }
            
            setLoadingState(u_conf.id);
            loadData(u_conf);
         }
      },
      
      setFilter = function setFilter() {
         
      },
      
      removeColumnFilter = function removeColumnFilter(brwID, field) {
         var u_conf = _divbrowser[id],
             u_idx  = -1;
         
         u_conf.savedColumnFilter.forEach(function traverseColumns(colObj, idx) {
            if(colObj.f === field) {
               u_idx = idx;
            }
         });
         
         if(u_idx > -1) {
            u_conf.savedColumnFilter.splice(u_idx, 1);
         }
      },
      
      sort = function sort(elem, field, direction) {
         var u_conf      = _getBrowserConfig(elem),
             u_direction = 'asc';
         
         if(direction === undefined) {
            if(u_conf.sort.length > 0) {
               if(u_conf.sort[0].field === field && u_conf.sort[0].direction !== 'desc') {
                  u_direction = 'desc';
               }
            }
         } else if(direction === 'asc' || direction === 'desc') {
            u_direction = direction;
         }
         
         u_conf.sort = [{field: field, direction: u_direction}];
         var u_idx = u_conf.sortableFields.indexOf(field);
         if(u_conf.sortableFields[u_idx].additionalSortColumn && u_conf.sortableFields[u_idx].additionalSortColumn.length > 0) {
            u_conf.sortableFields[u_idx].additionalSortColumn.forEach(function addSortFields(field) {
               if(typeof field === 'string') {
                  u_conf.sort.push({field: field, direction: 'asc'});
               } else {
                  u_conf.sort.push(field);
               }
            });
         }

         // TODO: set sort image
         /*$(elem).closest('tr').find('.sortable img').attr('src', 'sort_asc.png');
         if(u_direction === 'asc') {
            $(elem).find('img').attr('src', 'sort_asc.png');
         } else {
            $(elem).find('img').attr('src', 'sort_desc.png');
         }*/

         setLoadingState(u_conf.id);
         loadData(u_conf);
      },
      
      getRowData = function getRowData(elem) {
         if(typeof elem === 'string') {
            if(elem.indexOf('rowid_') === -1) {
               elem = $('#rowid_' + elem);
            } else {
               elem = $(elem);
            }
         }
         
         return _browserRowData[_getBrowserConfig(elem).id][$(elem).closest('tr').index()];
      },
      
      initDnD = function initDragAndDrop(brwID) {
         var u_conf = _getBrowserConfig(elem);
         
         $('#' + u_conf.id + ' a.dragicon').dragable({
                                                helper: function helperFunc() {
                                                   var u_tr = $(this).parents("tr:first");
                                                   
                                                   // TODO: Helper HTML
                                                   var u_html = '';
                                                   
                                                   return $(u_html);
                                                },
                                                zIndex: 1010,
                                                cursorAt: u_conf.dnd.cursorAt,
                                                appendTo: u_conf.dnd.appendTo,
                                                container: u_conf.dnd.container
                                              });

         $(u_conf.dnd.dropSelector).dropable({drop: u_conf.dnd.drop,
                                                      over: u_conf.dnd.over,
                                                      out: u_conf.dnd.out
                                                     });
      },
      
      destroy = function destroy(id) {
         delete _browserConfigs[id];
         delete _browserConfigsOriginal[id];
         delete _browserRowData[id];
      }
      
      return {
         loadData : loadData,
         setLoadingState: setLoadingState,
         resize : resize,
         setRowCount : setRowCount,
         navigate : navigate,
         setFilter: setFilter,
         sort: sort,
         getRowData: getRowData,
         initDragAndDrop: initDnD,
         destroy: destroy
      }
   }()
   
   ;
   
   global.addEventListener('popstate', function popstate(e) {
      if(PREVENT_HISTORY_BACK === false) {
         zs.history.handleHistoryBack(e);
      }
   });

   return {
      debug    : debug,
      i18n     : i18n,
      network  : network,
      content  : content,
      loading  : loading,
      message  : message,
      formular : formular,
      file     : file,
      modal    : modal,
      browser  : browser,
      history  : history
   }
}(window))); 
