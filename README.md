# zs.js - Business Application Framework

This is a framework for single page business applications. It's not complete. It is more like a starting point for new applications. I discovered that business applications often needs the same functionalities, but they use different frameworks. So this is a framework which gives you interfaces for common purposes like
* Content mangement with transitions
* Formular managment
* History managment
* Networking
* Loading state
* i18n
* File management (e.g. Upload)
* Modals/Dialogs
* Displaying messages (e.g. dialogs/modals, toasts, snackbar, ...)
* Browser/Table

The framework enforces a MVVM-Pattern.

The model is completely seperated and interchangeable. A PHP template is included within this package. But other programming language can be used and examples will be provided later.

Every View, called fragment, has its own HTML file. Text/Labels within the View are defined by placeholders [[Label]]. Every fragment has its own ViewModel (A Controller-JavaScript file). But all the fragments can also use shared controller JavaScript files, which provides a high code reusability.
