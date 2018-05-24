---
layout:     post
title:      Improving Spark's Subscription UX
date:       2016-05-22
excerpt:    Make Spark's plan selection clearer
tags: spark laravel php
theme: spark
---
<div class="alert alert-info" role="alert">
Note: This is untested in recent versions of Spark, however a similar modification should be possible.
</div>

## Requirements
You'll need a license for [Laravel Spark](https://spark.laravel.com), and you'll need to have got it working.

## The Problem
Here is the screen a user is sent to when they are not on a plan. The first plan "Basic" is automatically selected, but the "Selected" label can give the appearance that this is the plan that the user is on, when they are in fact on the Free plan, as indicated by the much smaller (and less noticable) text above.

<img src="/media/posts/2016-05-22-improving-sparks-subscription-ux/old.png" alt="" class="img-display">

## My Solution
I have made two changes to fix this:

- No plan is selected by default
- The billing form is hidden until a plan is selected

It's generally a bad idea to edit the code in the `src/` folder, as this will be overwritten by updates. Instead, Spark [provides a method](https://spark.laravel.com/docs/1.0/client-customization) to overwrite default code.

## Stop Spark Selecting a Plan
In the file `spark/resources/assets/js/spark-components/settings/subscription/subscribe-PROVIDER.js`, add a `ready()` method. Replace `PROVIDER` with your payment provider, either `stripe` or `braintree`.

{% highlight javascript %}
Vue.component('spark-subscribe-PROVIDER', {
    mixins: [base],

    ready: function() {
      this.selectedPlan = null;
      this.form.plan = "";
    }
});
{% endhighlight %}

## Hide the payment form by default
In the file `resources/views/vendor/spark/settings/subscription/subscribe-PROVIDER.blade.php`, add a `v-show` statement.

{% highlight html %}
<div class="panel panel-default" v-show="selectedPlan">
  <div class="panel-heading">Billing Information</div>
  ...
</div>
{% endhighlight %}

That's it! Now, when a user goes to the page (and is not subscribed already), the first plan will not be selected by default.

## FAQs

#### Why doesn't this break the 'Edit Subscription' page?
The js file is specifically for the 'Create Subscription' page, and will only be run if the user is not subscribed. If they are already subscribed, the plan they are on will be selected by default.

#### How can I do this on the register page?
There's [an answer](https://laracasts.com/discuss/channels/spark/change-default-plan/replies/170105) on the laracasts forums.
