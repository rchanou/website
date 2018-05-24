# Sokoban

This implementation of the classic box puzzle game uses Mobx for state management, and some interesting React component patterns, such as for:
- Declaring key-press/action maps
- Dynamically calculating keyboard arrow navigation of flex wrap elements
- Integrating Recaptcha

You can play with the components using `yarn add` and `yarn run cosmos` to run the development playground.

It uses serverless AWS services for the back end. Some of the AWS code is in the `aws` folder for reference.

Of course, the code could be cleaner, but I still think it's worth sharing.
