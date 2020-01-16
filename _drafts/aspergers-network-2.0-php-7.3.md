---
layout: post
title: "Asperger's Network 2.0 on PHP 7.3 - Or: How I Learned To Stop Hating Docker. And NginX. And PHP."
date: 2019-12-28
hero-image:
---

For the last two years, PHP 5.6 has been out of support. Which has meant maintaining a <a href="//aspergers.network" target="_new">legacy</a> piece of software. This has had its own complications, including that of trying to keep certain 'undesirables' out of the system. Until now, this has been a feat that has not always been successful, even when the website was in its heyday and I wasn't trying to migrate away from it. 

Alas, sometimes, it seems, the need to maintain a piece of software that you feel is dated, and that you feel you've grown from can have its drawbacks. For example, until recently, I had believed the only way to run it was on Apache. When the entire rest of your stack runs on NginX, this has its own issues. Maintaining an Apache configuration for one website barely seems worth it.

And then, as if by chance, I had a brainwave. What if, for some reason that was not completely sane, you decided you'd download Docker, go through the configuration process, set it all up, and *then* try to sort out the issues you've been having for _four_ years! 

Well, I did that. In about three hours, on the evening of December 27, 2019. As I tend to be a little on the stupid side, I did not check the website thoroughly and thought that it was "working" (Narrator: It wasn't) and that I could just push it live. 

<div class="embedimg">
    <img src="/images/screenshot/aspnt/p1i1.jpg" alt="Broken Asperger's Network Website" />
    <div class="caption">
        <p>Oh dear...</p>
    </div>
</div>