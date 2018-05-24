---
layout:     post
title:      Using Bootstrap 4 with Jekyll
date:       2018-05-22
excerpt:    Use Bootstrap 4 with Jekyll and Gitlab Pages
tags: jekyll bootstrap
theme: jekyll
---

Starting with Bootstrap 4, building from the SASS source requires [Autoprefixer](https://github.com/postcss/autoprefixer). In this article I'll show how I configured my Jekyll site to autoprefix the stylesheets and deployed this on Gitlab pages.

## Cloning Bootstrap
The easiest way to include Bootstrap's source in your project is using Git Submodules. If you don't have one already, create a `_sass` folder at the root of your project and clone bootstrap into it:

{% highlight bash %}
$ git submodule add https://github.com/twbs/bootstrap.git
{% endhighlight %}

This will get the latest commit of Boostrap, which you probably don't want, so go to the [releases](https://github.com/twbs/bootstrap/releases) page and get the tag name of the latest release. This is shown with a tag icon on the left-hand side.

<img src="/media/posts/2018-05-22-using-bootstrap-4-with-jekyll/tag.png" alt="The tag name is shown on the left-hand-side of each release." class="img-thumbnail mx-auto d-block img-fluid">

For this release the tag name is `v4.1.1`. Now check out this tag:
{% highlight bash %}
$ cd bootstrap
$ git checkout v4.1.1
{% endhighlight %}

You know have the SASS source of the latest version of Bootstrap. Now we need to tell Jekyll to compile it, with our modifications, into CSS.

## Including & Overriding
In the root of your Jekyll project, create a folder called `css`. Create a file called `styles.scss` with the following SCSS:

{% highlight scss %}
---

---
@import "main";
{% endhighlight %}

The `---` section (called front matter) tells Jekyll that it needs to process this file itself. This isn't required in any other SCSS files because they'll be processed by SASS.

In the `_sass` folder create an empty file called `variables.scss` and a file called `main.scss` containing this:

{% highlight scss %}
@import "variables";
@import "bootstrap/scss/bootstrap";
{% endhighlight %}

This will import any custom files we set in the variables file, then import Bootstrap itself. You can override anything in Bootstrap's own [variables file](https://github.com/twbs/bootstrap/blob/v4-dev/scss/_variables.scss).

In the `_config.yml` file make sure the following properties are set:
{% highlight yaml %}
sass:
  sass_dir: _sass
  style: compressed
{% endhighlight %}

This tells Jekyll that your SASS files are located in the `_sass` directory and that it should minify the CSS it produces. However, this CSS will still be missing the prefixes that Bootstrap requires. To add these, we'll need to use some additional gems.

## More Gems
Add the following gems to your `Gemfile`:
{% highlight ruby %}
gem 'jekyll-autoprefixer'
gem 'therubyracer'
{% endhighlight %}

`jekyll-autoprefixer` is the gem that provides the auto-prefixing for our styles. The [autoprefixer package](https://github.com/postcss/autoprefixer) uses JavaScript, so we use `therubyracer` to configure the V8 interpreter (a high performance JS interpreter) to run this package.

Now we have to tell Jekyll about autoprefixer by adding it to the config file. Add `'jekyll-autoprefixer'` to the `gems` property. My gems property looks like this, you may not be using the other gems or you may have extra.
{% highlight yaml %}
gems:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-autoprefixer
{% endhighlight %}

We don't need to register `therubyracer` because Jekyll itself doesn't actually use this package.

## Deploying with Gitlab Pages
Jekyll will now autoprefix our CSS so Bootstrap will work properly. Unfortunately Github pages doesn't support the necessary gems, so a different deployment method is required. It's possible to host this yourself, but Gitlab offer a similar service that allows complete configuration of the deployment process.

Create a new file in the root of your site called `.gitlab-ci.yml`. Paste [this configuration](/media/posts/2018-05-22-using-bootstrap-4-with-jekyll/pipeline-config.txt) into the file. There are a few important things in this file:
* `image:` sets a base image for the CI to use. Any image from [Docker Hub](https://hub.docker.com/) can be used.
* `variables:` sets Jekyll to run in production mode
* `before_script:` sets up the correct localisation (the build fails without this) and installs the gems
* `pages:` tells the CI what to run and where to put the resulting files. Gitlab pages will automatically see these files and start serving them.

Now commit those changes. You'll need to make an account on [Gitlab](https://gitlab.com) and then make a [new repository](https://gitlab.com/projects/new). You can make the repository public or private, this has no effect on the final website. Push your site to Gitlab.

## Adding Domains
In your Gitlab project, go to *Settings > Pages* and add a new domain. Gitlab requires SSL for custom domains, and there's a few ways you can do this.
* If you use Cloudflare, you can generate free [origin certificates](https://support.cloudflare.com/hc/en-us/articles/115000479507). Cloudflare will provide you with two keys to go in the two boxes on Gitlab. You'll need to add [Cloudflare's RSA root cert](https://support.cloudflare.com/hc/en-us/articles/218689638-What-are-the-root-certificate-authorities-CAs-used-with-Cloudflare-Origin-CA-) after your generated cert in the _Certificate (PEM)_ field.
* If you already have a valid certificate for this domain you can use that.
* If not, [you can use LetsEncrypt](https://about.gitlab.com/2016/04/11/tutorial-securing-your-gitlab-pages-with-tls-and-letsencrypt/) but this method requires you to manually renew every 90 days.

You will be asked to add a TXT record to the domain to verify ownership, and create the correct DNS record pointing to Gitlab pages. You can get the details on the [Gitlab documentation site](https://docs.gitlab.com/ee/user/project/pages/getting_started_part_three.html#tl-dr).

If you're hosting your site on the root domain (like this one) use the A record and corresponding TXT record.

If you're using a subdomain, use a CNAME record and the corresponding TXT record.

## Updating your site
When you want to update your site, just push to Gitlab. To check the progress of compiling your site, go to *CI/CD > Pipelines*. For each commit the current progress is shown, click it to see the live command line output.

To update Boostrap to a new version, from your site's root directory run:
{% highlight bash %}
$ git submodule update --recursive --remote
{% endhighlight %}

Then cd into the `_sass/bootstrap` directory and `checkout` the latest release tag in the same way as when we originally cloned the repository. If you return to your site's main directory and run `git status`, you'll see that the directory is marked as having new commits. Now just commit your repository and push.