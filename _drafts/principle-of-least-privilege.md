---
layout: post
title: "The Principle of Least Privilege"
subtitle: "Or: No, I Should Not Have Had To Type A Password For That Command!"
date: 2020-04-28
hero-image:
---
Linux. It runs servers everywhere. It runs on your phone. It runs the computer I'm using right now (Ok, yeah, you got me. I'm using macOS, but the principles are the same; I can type `sudo reboot`, and watch the computer go down for a restart no matter which console I'm using, for example). 

But every so often, I come across an issue that I'm not completely clear on. In this case, it's using the principle of least privilege. This is about to get technical. Send help. 

In Systems Administration, there's a methodology called the 'Principle of Least Privilege'. That is to say, you should always assign a user the _least necessary_ privilege for them to do their job in a majority of circumstances. A good example of this would be, you know, not giving your daily account at work Domain Admin privileges. 

When we were at TAFE, we would break this on a regular basis. We ran our own network, and in a majority of the cases, we needed to be Domain Admins to do the work we needed to do to stop that network falling over. It was far from an elegant solution but it worked for us. 

But now, I'm not at TAFE. The idea of deploying the new Asperger's Network website to the internet greatly excites me. But I'm in a position where I have to run it under its own user (seeing as it's now a compiled application); I need to make sure that user cannot possibly be breached and do something it isn't meant to do. 

To start: What does the `aspergersnetwork` user need to be able to achieve? 
* Git Pull from a repo over SSH
* swift build
* service aspergersnetwork restart

In other words, three tasks. That's it.

You must always remember that Linux runs a bunch of processes under a bunch of different users, and that screwing with who runs what is 100% proven* to always cause a bad day. <small>* based on a small percentage of gullible SysAdmins making things called "Network Shears". No, I don't know what they are either</small>

<div class="embedimg">
    <a href="https://bdc.id.au/images/blog/principle-least-privilege/lpi1.png" target="_new">
        <img src="/images/blog/principle-least-privilege/lpi1.png" alt="htop Output" />
    </a>
    <div class="caption">
        <p>htop Output On Our Development Web Server</p>
    </div>
</div>

You'll see in the screenshot above our ideal output: The website is running there under its own user. 

So how would we go about attacking this particular issue? 

Ideally, the "app" should run as a system service under `system.d`. This would allow the app to restart itself when it crashes. This is achieved by one line: `Restart=always`. The system is then smart enough to restart on its own. Automation: Check. 

Because the app is a system.d service, we should be able to interact with this through the user, without a password so that when our Jenkins instance builds and then deploys the code, we can quickly restart the service to get the freshest build running. Yes, we could technically deploy over the root user, but this would be a violation of the Principle of Least Privilege and would cause all manner of headaches when it chowns files to root. We don't want that. 

Actually, funnily, while I was typing up this blog post I buggered up something fierce. 

<div class="embedimg">
    <a href="https://bdc.id.au/images/blog/principle-least-privilege/lpi2.png" target="_new">
        <img src="/images/blog/principle-least-privilege/lpi1.png" alt="Oops." />
    </a>
    <div class="caption">
        <p>Oops. Didn't mean to do that!</p>
    </div>
</div>

I failed to use the right path for the app, and then tried to make system.d start an app that doesn't exist. Don't be like me. 

In (this)[] stackoverflow post, it says I should use the 