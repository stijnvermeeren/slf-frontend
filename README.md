# Viewer for SLF maps

**Visit the web page at [https://stijnvermeeren.be/slf](https://stijnvermeeren.be/slf).**

A web page that aims to make the maps from the [SLF archive](https://www.slf.ch/de/lawinenbulletin-und-schneesituation/archiv.html) more accessible, giving easy insights into questions like:

* How much snow is there compared to last year?
* How did the snow depth evolve over the course of the winter?
* How much snow is there currently, compared to the date of a particular photo or ski touring report (e.g. [Gipfelbuch](http://www.gipfelbuch.ch/gipfelbuch/verhaeltnisse), [Hikr](http://www.hikr.org/), [Camptocamp](https://www.camptocamp.org/)).

This project is made using [Vue.js](https://vuejs.org/), with [Vuex](https://github.com/vuejs/vuex), [vue-resource](https://github.com/pagekit/vue-resource), [vue-twentytwenty](https://github.com/mhayes/vue-twentytwenty), [Keen UI](https://github.com/JosephusPaye/Keen-UI) and [moment.js](https://momentjs.com/).

Maps are crawled by my [Scala crawler](https://github.com/stijnvermeeren/slf-crawler) every day at 10am and 6pm Central European Time and served from an [Amazon S3](https://aws.amazon.com/s3/) bucket.
