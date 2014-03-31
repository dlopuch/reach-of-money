voice-of-money
==============

We have a problem in politics today: money. It doesn't have a voice. Hundreds of millions of it is poured into
individual races, but you never hear politicians expressing what is important to money. Instead, all you hear is talk
of jobs and well-being, as if that was important. No airtime is being spent on the important issues.

In this project, built for the [Hack for Democracy](http://www.eventbrite.com/e/hack-for-democracy-registration-10711042015)
San Francisco weekend hackaton, we give voice to the neglected money in politics. What if candidates could speak up for
their contributions' priorities? We look up public records on candidates' campaign contributions and use them to
helpfully auto-generate a short biography expressing the candidate's true voice, as defined by the political quid pro
debt taken on by his or her various contributions.

Check it out: [http://dlopuch.github.io/voice-of-money](http://dlopuch.github.io/voice-of-money)

-----

Tech-stack: All client-side javascript using RequireJS, Backbone, and some light Bootstrap.  Data thanks to the
[followthemoney.org](http://www.followthemoney.org) API provided by the National Institute on Money in State Politics.

To run locally:
* `$ cd public`
* `$ python -m SimpleHTTPServer`
* [http://localhost:8000](http://localhost:8000)

-------

Released under the GPL v2 license.

    voice-of-money
    Copyright (C) 2014 Dan Lopuch

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
