---
layout: post
title: "The Principle of Least Privilege"
subtitle: "Or: No, I Should Not Have Had To Type A Password For That Command!"
date: 2020-03-23
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