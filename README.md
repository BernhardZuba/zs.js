# zs.js - Business Application Framework

This is a framework for single page business applications. It's not complete. It is more like a starting point for new applications. I discovered that business applications often need the same functionalities, but they use different frameworks. So this is a framework which gives you interfaces for common purposes like
*	Content management with transitions
*	Form management
*	History management
*	Networking
*	Loading state
*	i18n
*	File management (e.g. Upload)
*	Modals/Dialogs
*	Displaying messages (e.g. dialogs/modals, toasts, snackbar, ...)
*	Browser/Table

You have to implement your own code for these interfaces. I will provide simple example applications later.

The framework enforces a MVVM-Pattern.

The model is completely separated and interchangeable. A PHP template is included within this package. But other programming language can be used and examples will be provided later.

Every View, called fragment, has its own HTML file. Text/Labels within the View are defined by placeholders [[Label]]. Every fragment has its own ViewModel (A Controller-JavaScript file). But all the fragments can also use shared controller JavaScript files, which provides a high code reusability.

