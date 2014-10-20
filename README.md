# CRUD Admin Generator

> Yeoman generator for AngularJS - lets you quickly set up a project with sensible defaults and best practices.


## Getting Started

### Install Yeoman

```bash
$ npm install -g yo
```

## Angular Fullstack CRUD

To install generator-admin from npm, run:

```bash
$ npm install -g generator-admin
```

Next, ensure you have a (mostly?) blank version of an angular-fullstack site.  For best results, execute the generator against a completely fresh/new angular-fullstack site.

This can be accomplished by creating a new directory, and generating:

```bash
$ yo angular-fullstack
```

Next, create a config.json file to drive the crud generation.  The admin generator comes with an example file, config.json.  The only update required within this example is to correctly set the 'appName' property to whateve your angular-fullstack application is named.  Here is an example of what this config might look like:

```json
{
    "clean": true,
    "appName": "SampleApp",
    "globalModel":
    {
        "name": "String",
        "creation_datetime": "Date"
    },
    "entities": [
        {
            "name": "reservation",
            "model": {
                "headcount": "Number",
                "reservation_datetime": "Date",
                "guest_id": "ManualReference"
            }
        },
        {
            "name": "table",
            "model": {
                "capacity": "Number"
            }
        },
        {
            "name": "server",
            "model": {
                "name": "String",
                "table": "MongooseReference:Table"
            }
        },
        {
            "name": "guest",
            "model": {
                "favorite_meal": "String"
            }
        }
    ]
}
```


Copy that into the root of your new angular-fullstack site, and run the following:

```bash
$ yo admin
```

Using the values found in the config file, the generator will add views, controllers, models, etc to add the configured CRUD objects to your application.  There are certain blocks of code that need to be injected into existing files (for example, the routes file).  There are two ways the admin generator can accomplish this:

* If being executed for the first time, it will look for certain code signatures in the newly generated angular-fullstack site, and inject there.  It will also leave "markers" that it uses for subsequent generation.

* If being executed again against a site, it will rely on the "markers" to know where to inject code.  The markers will look something like this:

```js
    // ROUTE INCLUDES BEGIN
    // ROUTE INCLUDES END
```

This process is a little fragile, and will work incorrectly if the existing angular-fullstack code looks differently than what the generator expects.  For best results, use the "marker" paradigm, and code will always be injected into the correct place.

## License

MIT
