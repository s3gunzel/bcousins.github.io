---
layout: post
title: "Building My Own Server"
subtitle: "Or: The Long Road To Move To ARM Based Servers!"
date: 2022-08-01
meta-title: "Building My Own Server"
meta-descr: "Or: The Long Road To Move To ARM Based Servers!"
hero-image:
---
In 2015-ish, I went to the CeBit Technology Show held at the Convention Centre in Sydney. While I was there, I investigated the possibility of putting my own server into a datacenter, also in Sydney. I ended up with a pretty good deal with Servers Australia. I love my 'web host', and will continue to use them well into the future. But the time has now come to replace the server in the datacenter, and I really want to go ARM! 

### The Plan


### Considerations
The server currently at Equinix is a Dell 2950. It is an old server, and while it has served us well - is well overdue for replacement. It caps out at a paltry (for 2022 standards) 32GB of RAM. Which we have installed into it. We run ESXi on the server - and we run a good amount of virtual servers. 

Our current utilisation of the server is: 
<div class="embedimg">
    <a href="//bdc.id.au/images/blog/building-my-own-server/server-use-stats.jpg" title="Click To View Full Size">
        <img src="/images/blog/building-my-own-server/server-use-stats.jpg" alt="2950 Server Use Stats" />
    </a>
    <div class="caption">
        <p>Current Server Use Statistics <br> <small>Click or tap image to view full size</small></p>
    </div>
</div>

We run a good amount of Alpine Linux virtual machines as docker hosts, and pfSense as a firewall. Because these servers all run behind a firewall on ESXi, they do not require cables. This is, and has been, very convenient. It has meant that I have not needed to worry about cables and cable management in our 2RU allocation.