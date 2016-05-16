# Greenville Trolley Tracker - Alexa Integration

This app runs on AWS Lambda and acts as a simple query engine for the [Greenville Trolley Tracker](http://trackthetrolley.com/). It's interfaced with via the [Alexa](http://alexa.amazon.com/) voice command engine, provided by Amazon. I'm testing it out on my Amazon Tap, but it should work equally well using an Echo, Dot, or any other Alexa-enabled smart device.

This is a personal learning project for now, but suggestions are welcomed as issues! If you fork this and discover an operational bug I'd love to hear about it as well.

## Setup

Interesting in forking and building onto this project? Setup is simple:

1. `cd package && npm install`
2. `zip ../alex-trolley.zip ./*`
3. Upload the resulting ZIP file to AWS Lambda.
4. Configure your test Alexa app with your new Lambda endpoint.

## Credits

Thanks to the awesome volunteer team at [Code For Greenville](http://codeforgreenville.org/) for setting up the API this relies on! I sincerely hope this becomes a useful addition to the Trolley Tracker suite of apps.

### Thanks for your interest! 
