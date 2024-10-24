# AI text summarisation for fun and profit

## TL:DR
One or more files containing text (PDFs for now) will be summarised.   
The summaries will be embedded and saved in a VectorDB for fast and semantic search.   
A GraphDB will be employed for extracting relationships.
Summarised material will be converted to speech using a TTS.      

## Introduction 
This is a great opportunity for me to expand my knowledge while building tools that make me more productive. My next project pertains writing an agentic AI system that summarises interesting teaching and research material. It'll work on device, no internet connection or cloud computing resources should be required.  
I'll start by processing PDFs, due to how ubiquitous this format is.  

## Motivation
An extensive list of lecture videos on my watch list, complemented by a lengthy list of books and articles I'd like to go through, motivate me to write a tool that'll help me go through material more efficiently. This can be achieved through summarisation, which is a form of lossy compression.   
Inspired by Google's [Illuminate](https://illuminate.google.com/) as well as [NotebookLM](https://blog.google/technology/ai/notebooklm-google-ai/), I started considering turning longer form text (books and articles or video transcripts) to distilled audio summaries that I can listen to while away from the computer. Here are a couple of examples of the lossy compression I'm referring to:  
* [Artificial Intelligence Index Report 2024](https://illuminate.google.com/home?play=Pa5iGH1___bGy1) (8min, [report link](https://aiindex.stanford.edu/wp-content/uploads/2024/05/HAI_AI-Index-Report-2024.pdf), 502 pages)
* [Large Language Models Encode Clinical Knowledge](https://illuminate.google.com/home?play=TgFAln__6WEz) (3min, [arXiv link](https://arxiv.org/pdf/2212.13138), 44 pages)  

### Compression ratio
The average [words per minute](https://en.wikipedia.org/wiki/Words_per_minute) (wpm) for spoken English is 228+/-30. Given that the above examples from Illuminate are designed to emulate a discussion, I'll use the lower wpm end i.e. 200.  
Illuminate's AI index report 2024 discussion spans about 8 minutes, which corresponds to about 1600 words. Running `pdftotext HAI_AI-Index-Report-2024.pdf - | wc -w` returns a total of 116068 words for this sizeable document. This amounts to a 72.5 compression ratio (116068 words / (200 wpm * 8 min)).  
Similarly, the compression ratio for the LLM arXiv paper is 42.2 (25328 words / (200 wpm * 3 min)).   

## Architecture

### PDF processing

### Database
Qdrant

### Text summarisation with an LLM
LlamaIndex

### TTS
Piper

### Simple GUI


### Main application logic



