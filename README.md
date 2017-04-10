# My Website (WIP)

[![Greenkeeper badge](https://badges.greenkeeper.io/rchanou/website.svg)](https://greenkeeper.io/)

The source code for my site at [ron.chanou.info](http://ron.chanou.info)

Right now it only contains a WIP Sokoban game.

It experiments with mobx for state management and some interesting React component patterns such as for:
- Declaring key-press/action maps
- Dynamically calculating keyboard arrow navigation of flex wrap elements
- Integrating Recaptcha

(Note: I plan on refactoring the store system using a different, less tangled approach. I'm aware it's a bit of mess now.)

You can play with the components using `yarn add` and `yarn run cosmos` to run the development playground.

It uses serverless AWS services for the back end. Some of the AWS code is in the `aws` folder for reference. 

I'm constantly working on this. Check every so often for new changes!
