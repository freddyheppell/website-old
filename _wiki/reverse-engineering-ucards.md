---
title: Reverse Engineering UCards
layout: wiki
date: 2019-07-01
---

This is some basic technical information about the University of Sheffield's UCards. It's not that interesting...

## Front Barcode
The barcode on the front of the card is a barcode encoding the UCard Number. The standard symbology for a barcode is Code 128, but UCards use the less dense (and therefore longer) Code 39. It's likely that this is intentional so the barcode is easier to scan. 

## Back Magnetic Stripe

The magnetic strip just contains the UCard number on the second track. The first is empty, and the third is either empty or not present at all - it's not possible to tell with my low-budget magstripe reader.

When read with a standard magnetic stripe reader this produces `;_Ucard Number_?` (";" and "?" are the start and end sentinels for the 2<sup>nd</sup> track.)


## Internals
The card doesn't have an RFID chip (or anything else hidden internally).


