### I don't know what to call this so for now, it's "Front End".

What it does is takes a bunch of code linters and profilers and combines them into one. It will lint you JS, CSS and Sass. Once the task is complete, it will upload your data to Graphite/Grafana. Completely inspired by -- and some code stolen from -- [sitespeed.io](https://www.sitespeed.io/).

#### Example

```
frontend --js <PATH_TO_JS> --css <PATH_TO_CSS> --scss <PATH_TO_SASS> --includeProfiler=jscs --excludeProfiler=eslint,stylestats,complexity,csslint
```

I haven't worked on it in a while so the API isn't as fresh as it should be but still pretty fun. Probably need to `npm link` it for now since it's not a published package on NPM.

#### TODO

* Make it find all JS, CSS etc in the directories passed
* Output HTML like how [sitespeed.io](https://www.sitespeed.io/) does -- it rocks, you should use it if you don't already
* Smarter default profilers
* ¯\\\_(ツ)_/¯
