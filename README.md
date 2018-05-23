# Sokoban

The source code for my Sokoban game and puzzle editor at [ron.chanou.info/sokoban](http://ron.chanou.sokoban)

It experiments with Mobx for state management and some interesting React component patterns such as for:
- Declaring key-press/action maps
- Dynamically calculating keyboard arrow navigation of flex wrap elements
- Integrating Recaptcha

(Note: I plan on refactoring the store system using a different, less tangled approach. I'm aware it's a bit of mess now.)

You can play with the components using `yarn add` and `yarn run cosmos` to run the development playground.

It uses serverless AWS services for the back end. Some of the AWS code is in the `aws` folder for reference. 
