---
layout: post
title: "🔁 GitHub Actions for yt-dlp-hq"
date: 2024-10-08
tags: [github-actions, ci-cd, yt-dlp, deno, typescript, cross-platform]
---

**TL;DR:** This article details the development of a Deno-based tool for downloading high-quality videos with audio using yt-dlp, highlighting unexpected challenges with GitHub Actions where compiled executables became unusable after release-ultimately solved by compressing executables into .tar files, preserving functionality whilst revealing potential limitations in GitHub's release mechanisms. 
<!--more-->
**[Was it worth my time](https://xkcd.com/1205/)?** 

## Introduction 
There are times where I need to use my computer offline, e.g. when I'm travelling. Having to stay offline is a good opportunity for me to study some lectures of interest, without distractions. For that, I need offline access to the videos I'm interested in.  
[yt-dlp](https://github.com/yt-dlp/yt-dlp) is a great open-source project that allows the user to download audio and/or video from a wide array of platforms including YouTube. Recently, I noticed that it's no longer as straightforward to download a video with audio, using `yt-dlp`. One workaround is to download the audio and video streams separately, and merge them using [FFmpeg](https://ffmpeg.org/). This was a good opportunity to write a small automation project in a language I'm interested in.  

### `yt-dlp` And YouTube
Here's an example that motivates implementing this project. Imagine I'd like to download a video from the excellent [IBM Technology](https://www.youtube.com/channel/UCKWaEZ-_VweaEx1j62do_vQ) YouTube channel, for instance [What are AI Agents](https://www.youtube.com/watch?v=F8NKVhkZZWI). Listing the video's available formats, returns the following table   
```console
$ yt-dlp -F https://www.youtube.com/watch\?v\=F8NKVhkZZWI
[youtube] Extracting URL: https://www.youtube.com/watch?v=F8NKVhkZZWI
[youtube] F8NKVhkZZWI: Downloading webpage
[youtube] F8NKVhkZZWI: Downloading ios player API JSON
[youtube] F8NKVhkZZWI: Downloading web creator player API JSON
[youtube] F8NKVhkZZWI: Downloading m3u8 information
[info] Available formats for F8NKVhkZZWI:
ID      EXT   RESOLUTION FPS CH │   FILESIZE   TBR PROTO │ VCODEC          VBR ACODEC      ABR ASR MORE INFO
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
sb3     mhtml 48x27        0    │                  mhtml │ images                                  storyboard
sb2     mhtml 80x45        0    │                  mhtml │ images                                  storyboard
sb1     mhtml 160x90       0    │                  mhtml │ images                                  storyboard
sb0     mhtml 320x180      0    │                  mhtml │ images                                  storyboard
233     mp4   audio only        │                  m3u8  │ audio only          unknown             [en] Default
234     mp4   audio only        │                  m3u8  │ audio only          unknown             [en] Default
139-drc m4a   audio only      2 │    4.35MiB   49k https │ audio only          mp4a.40.5   49k 22k [en] low, DRC, m4a_dash
139     m4a   audio only      2 │    4.35MiB   49k https │ audio only          mp4a.40.5   49k 22k [en] low, m4a_dash
249     webm  audio only      2 │    4.37MiB   49k https │ audio only          opus        49k 48k [en] low, webm_dash
250     webm  audio only      2 │    5.27MiB   59k https │ audio only          opus        59k 48k [en] low, webm_dash
140-drc m4a   audio only      2 │   11.55MiB  129k https │ audio only          mp4a.40.2  129k 44k [en] medium, DRC, m4a_dash
140     m4a   audio only      2 │   11.55MiB  129k https │ audio only          mp4a.40.2  129k 44k [en] medium, m4a_dash
251     webm  audio only      2 │    9.45MiB  106k https │ audio only          opus       106k 48k [en] medium, webm_dash
602     mp4   256x144     15    │ ~  7.26MiB   81k m3u8  │ vp09.00.10.08   81k video only
394     mp4   256x144     30    │    4.36MiB   49k https │ av01.0.00M.08   49k video only          144p, mp4_dash
269     mp4   256x144     30    │ ~ 11.26MiB  126k m3u8  │ avc1.4D400C    126k video only
160     mp4   256x144     30    │    2.97MiB   33k https │ avc1.4D400C     33k video only          144p, mp4_dash
603     mp4   256x144     30    │ ~ 13.63MiB  153k m3u8  │ vp09.00.11.08  153k video only
278     webm  256x144     30    │    7.23MiB   81k https │ vp09.00.11.08   81k video only          144p, webm_dash
395     mp4   426x240     30    │    5.90MiB   66k https │ av01.0.00M.08   66k video only          240p, mp4_dash
229     mp4   426x240     30    │ ~ 14.99MiB  168k m3u8  │ avc1.4D4015    168k video only
133     mp4   426x240     30    │    4.49MiB   50k https │ avc1.4D4015     50k video only          240p, mp4_dash
604     mp4   426x240     30    │ ~ 21.46MiB  241k m3u8  │ vp09.00.20.08  241k video only
242     webm  426x240     30    │    7.38MiB   83k https │ vp09.00.20.08   83k video only          240p, webm_dash
396     mp4   640x360     30    │   10.27MiB  115k https │ av01.0.01M.08  115k video only          360p, mp4_dash
230     mp4   640x360     30    │ ~ 29.86MiB  335k m3u8  │ avc1.4D401E    335k video only
134     mp4   640x360     30    │    7.76MiB   87k https │ avc1.4D401E     87k video only          360p, mp4_dash
18      mp4   640x360     30  2 │   32.38MiB  363k https │ avc1.42001E         mp4a.40.2       44k [en] 360p
605     mp4   640x360     30    │ ~ 39.56MiB  444k m3u8  │ vp09.00.21.08  444k video only
243     webm  640x360     30    │   12.52MiB  140k https │ vp09.00.21.08  140k video only          360p, webm_dash
397     mp4   854x480     30    │   17.06MiB  191k https │ av01.0.04M.08  191k video only          480p, mp4_dash
231     mp4   854x480     30    │ ~ 37.90MiB  425k m3u8  │ avc1.4D401F    425k video only
135     mp4   854x480     30    │   11.28MiB  126k https │ avc1.4D401F    126k video only          480p, mp4_dash
606     mp4   854x480     30    │ ~ 50.26MiB  564k m3u8  │ vp09.00.30.08  564k video only
244     webm  854x480     30    │   17.41MiB  195k https │ vp09.00.30.08  195k video only          480p, webm_dash
398     mp4   1280x720    30    │   31.31MiB  351k https │ av01.0.05M.08  351k video only          720p, mp4_dash
232     mp4   1280x720    30    │ ~ 57.85MiB  649k m3u8  │ avc1.4D401F    649k video only
136     mp4   1280x720    30    │   20.16MiB  226k https │ avc1.4D401F    226k video only          720p, mp4_dash
609     mp4   1280x720    30    │ ~ 72.26MiB  810k m3u8  │ vp09.00.31.08  810k video only
247     webm  1280x720    30    │   27.69MiB  310k https │ vp09.00.31.08  310k video only          720p, webm_dash
399     mp4   1920x1080   30    │   63.06MiB  707k https │ av01.0.08M.08  707k video only          1080p, mp4_dash
270     mp4   1920x1080   30    │ ~193.27MiB 2167k m3u8  │ avc1.640028   2167k video only
137     mp4   1920x1080   30    │   96.17MiB 1078k https │ avc1.640028   1078k video only          1080p, mp4_dash
614     mp4   1920x1080   30    │ ~164.68MiB 1847k m3u8  │ vp09.00.40.08 1847k video only
248     webm  1920x1080   30    │   91.43MiB 1025k https │ vp09.00.40.08 1025k video only          1080p, webm_dash
616     mp4   1920x1080   30    │ ~322.53MiB 3617k m3u8  │ vp09.00.40.08 3617k video only          Premium
```  

It looks like the only ID containing a video _with_ audio, is `18`, i.e. a 420p, 640x360 video according to my media player. This might be sufficient for a video like the above, but such low resolution would make it almost impossible to read code or smaller writing.

## My Solution 
Given I have started leveraging Deno for my needs, I wrote a small tool called [yt-dlp-hq](https://github.com/ai-mindset/yt-dlp-hq). It's certainly basic, with lots of room for improvement. However it does exactly what I need and I'm relatively happy with the result, pending some improvements[^1].  
Deno is great for cross-compilation. Also, GitHub Actions can be a good method for automating testing, running, compiling etc.[^2] Is it though? Let's see.  

## My CI Pipeline
I started off by using [act](https://nektosact.com/introduction.html), a very nice tool that allows for testing pipelines locally. The main downside I found was that for an intermediate Docker user with little `act` experience, sometimes GitHub Actions don't behave the same way locally as they would online. Also, I like [podman](https://podman.io/) considerably better, since it's daemonless and not as resource-hungry among others.  
Putting `act` aside, I focused on setting up a [pipeline](https://github.com/ai-mindset/yt-dlp-hq/blob/main/.github/workflows/ci.yml) that'd work well enough with every new PR opened against `main` aside from others.  
The pipeline ran successfully, where in theory it built and released `yt-dlp-hq` executables. However, when I downloaded the corresponding executable for my OS and CPU architecture, it did not run. When I locally built the same set of executables, running `deno task build`, the executable for my OS & arch worked as expected. This made me wonder whether I'm doing something wrong, if it's a GitHub Action intricacy or some other issue I needed to resolve. 
Inspired by Medicine, I tried approaching the issue through differential diagnosis, which to my understanding works by excluding other causes in order to hone in on the actual medical condition. I.e. I first created a release directory locally. I then manually created a release on GitHub. To my dismay, the executable I manually uploaded didn't run when I downloaded it back from GitHub. This made me wonder if there is a conversion involved when a pipeline generates executables or the user uploads them manually for release. Spoiler alert: I still don't know if that's the case, but I suspect that GitHub indeed doesn't save executables without some change taking place during upload. 

### Fixing Executables GitHub Release 
Initially, I changed the following setting on my repository:   
_"Settings -> Actions -> General -> Workflow permissions"_ select  _"Read and write permissions"_.
Then, I experimented with compressing each generated executable into a .tar file. This did the trick. Simply compressing an executable is enough to maintain its function. Thus, the way to install `yt-dlp-hq` takes one extra step.  
For example, if you're a Linux user on an Intel-based machine, here's how you can use my tool   
```console
$ curl -L -O https://github.com/ai-mindset/yt-dlp-hq/releases/download/1.0.0/yt-dlp-hq-intel-linux.tar && tar xvf yt-dlp-hq-intel-linux.tar && cd release
$ ./yt-dlp-hq-intel-linux https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

## Conclusion
I'm glad I learned something more about GitHub and Actions, its idiosyncrasies and abilities. It took me a couple days, which made me consider the benefits of [automation](https://xkcd.com/1319/). Being more minimalistic, I tend to opt for simple automation when possible [_if_ it's worth it](https://xkcd.com/1205/). To quote [Alan Perlis](https://en.wikiquote.org/wiki/Alan_Perlis), "_Simplicity does not precede complexity, but follows it_".

---
[^1]: Some improvements I'm planning include unit testing, automatic audio & video ID selection and possibly automatic FFmpeg installation when it's not available in `$PATH`.  
[^2]: A [Juiia](https://julialang.org/) enthusiast introduced me to [Woodpecker CI](https://woodpecker-ci.org/) and [Codeberg](https://codeberg.org/). I'm definitely considering switching, following my recent GitHub Actions experience 🤔 
