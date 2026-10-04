---
title: AutoLLD
order: 4
featured: true
visual: autolld
category: AI experiment
tagline: Code → documentation
description: Turning source code into low-level design documents. An experiment in making complex codebases easier to understand.
focus: Developer tooling & AI
platform: Python / command line
externalUrl: https://github.com/lakshmikantdeshpande/AutoLLD
externalLabel: Explore the source
---

## The design hidden in the code

Source code contains a system's implementation, but the bigger picture can be harder to see. AutoLLD explores how language models can help turn that code into low-level design documentation.

It is a Python tool that processes a repository and generates an HTML design document.

## From repository to document

AutoLLD clones and parses a repository, splits the source into chunks, and generates documentation with an LLM. It then merges the intermediate documents into a consolidated output.

The project also works with Mermaid diagrams, aiming to include visual explanations alongside the written design.

## A starting point for understanding

Generated documentation needs review against the source. The useful role for this kind of tool is to give an engineer a first map of the codebase, with the implementation remaining the source of truth.

AutoLLD is one of my experiments in using AI for practical engineering work.

[Read the README and explore the code →](https://github.com/lakshmikantdeshpande/AutoLLD)
